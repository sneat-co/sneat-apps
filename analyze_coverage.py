import os
import xml.etree.ElementTree as ET
from pathlib import Path

def get_coverage_data():
    projects = []
    coverage_dir = Path('coverage')
    if not coverage_dir.exists():
        return []
    
    for clover_file in coverage_dir.glob('**/clover.xml'):
        try:
            tree = ET.parse(clover_file)
            root = tree.getroot()
            project_metrics = root.find('project/metrics')
            if project_metrics is not None:
                statements = int(project_metrics.get('statements', 0))
                covered_statements = int(project_metrics.get('coveredstatements', 0))
                uncovered_lines = statements - covered_statements
                coverage_pct = (covered_statements / statements * 100) if statements > 0 else 100
                
                # Derive project name from path
                # e.g. coverage/libs/core/clover.xml -> core
                parts = clover_file.parts
                if 'libs' in parts:
                    idx = parts.index('libs')
                    project_name = '-'.join(parts[idx+1:-1])
                elif 'apps' in parts:
                    idx = parts.index('apps')
                    project_name = '-'.join(parts[idx+1:-1])
                else:
                    project_name = clover_file.parent.name

                is_core = 'core' in project_name or 'shared' in project_name or project_name == 'core'
                
                projects.append({
                    'name': project_name,
                    'statements': statements,
                    'covered': covered_statements,
                    'uncovered': uncovered_lines,
                    'coverage_pct': round(coverage_pct, 2),
                    'is_core': is_core
                })
        except Exception as e:
            print(f"Error parsing {clover_file}: {e}")
    
    return projects

def main():
    projects = get_coverage_data()
    
    # Sort: Core first, then by uncovered lines descending
    sorted_projects = sorted(projects, key=lambda x: (not x['is_core'], -x['uncovered']))
    
    print(f"{'Project':<30} | {'Core':<5} | {'Coverage %':<10} | {'Uncovered Lines':<15}")
    print("-" * 70)
    for p in sorted_projects:
        print(f"{p['name']:<30} | {str(p['is_core']):<5} | {p['coverage_pct']:<10}% | {p['uncovered']:<15}")

if __name__ == "__main__":
    main()
