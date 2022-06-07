import { NgModule } from '@angular/core';
import { GenderIconName } from './gender-icon-name.pipe';
import { LongMonthNamePipe } from './long-month-name.pipe';
import { MemberTitle } from './member-title.pipe';
import { PersonTitle } from './person-title.pipe';
import { SelectedMembersPipe } from './selected-members.pipe';
import { ShortMonthNamePipe } from './short-month-name.pipe';
import { TeamEmojiPipe } from './team-emoji.pipe';
import { WdToWeekdayPipe } from './wd-to-weekday.pipe';

const pipes: any[] = [
	TeamEmojiPipe,
	WdToWeekdayPipe,
	LongMonthNamePipe,
	ShortMonthNamePipe,
	MemberTitle,
	PersonTitle,
	GenderIconName,
	SelectedMembersPipe,
];

@NgModule({
	declarations: pipes,
	exports: pipes,
})
export class SneatPipesModule {

}
