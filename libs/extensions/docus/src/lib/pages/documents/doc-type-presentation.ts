import { standardDocTypesByID } from '@sneat/extension-assetus-contract';

// Display title + emoji for each document type.
//
// The legacy @sneat/mod-assetus-core standardDocTypesByID carried `title` and
// `emoji` on every entry; the live @sneat/extension-assetus IDocTypeDef is
// validation-only ({ id, fields }) and dropped these presentation fields (and
// renamed birth_certificate/marriage_certificate -> birth_cert/marriage_cert).
// This map re-supplies the labels docus renders so the migration is
// presentation-neutral. TODO: fold title/emoji back into the lib's IDocTypeDef
// and delete this map.
const docTypePresentation: Record<string, { title: string; emoji?: string }> = {
  other: { title: 'Other' },
  passport: { title: 'Passport', emoji: '🛂' },
  driving_license: { title: 'Driving license', emoji: '🚗' },
  birth_cert: { title: 'Birth certificate', emoji: '👼' },
  marriage_cert: { title: 'Marriage certificate', emoji: '💍' },
};

export interface IDocTypeListItem {
  readonly id: string;
  readonly title: string;
  readonly emoji?: string;
}

// The live doc types, each decorated with its display title + emoji, in the
// lib's declaration order.
export const docTypeListItems: readonly IDocTypeListItem[] = Object.values(
  standardDocTypesByID,
).map((def) => ({
  id: def.id,
  title: docTypePresentation[def.id]?.title ?? def.id,
  emoji: docTypePresentation[def.id]?.emoji,
}));
