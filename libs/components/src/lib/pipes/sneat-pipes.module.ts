import { NgModule, PipeTransform, Type } from '@angular/core';
import { CountryFlagPipe, CountryTitle } from './country-emoji.pipe';
import { Decimal64p2Pipe, Numeral2Pipe } from './decimal64p2.pipe';
import {
	GenderColorPipe,
	GenderEmojiPipe,
	GenderIconNamePipe,
} from './gender.pipes';
import { LongMonthNamePipe } from './long-month-name.pipe';
import { ContactTitlePipe } from './member-title.pipe';
import { PersonNamesPipe, PersonTitle } from './person-title.pipe';
import { SelectedMembersPipe } from './selected-members.pipe';
import { ShortMonthNamePipe } from './short-month-name.pipe';
import { SpaceEmojiPipe } from './team-emoji.pipe';

const pipes: Type<PipeTransform>[] = [
	SpaceEmojiPipe,
	LongMonthNamePipe,
	ShortMonthNamePipe,
	ContactTitlePipe,
	PersonTitle,
	PersonNamesPipe,
	GenderIconNamePipe,
	GenderEmojiPipe,
	GenderColorPipe,
	SelectedMembersPipe,
	CountryFlagPipe,
	CountryTitle,
	Decimal64p2Pipe,
	Numeral2Pipe,
];

@NgModule({
	declarations: [pipes, Numeral2Pipe],
	exports: pipes,
})
export class SneatPipesModule {}
