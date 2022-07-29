import { NgModule } from '@angular/core';
import { CountryFlagPipe, CountryTitle } from './country-emoji.pipe';
import { GenderColorPipe, GenderEmojiPipe, GenderIconNamePipe } from './gender.pipes';
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
	GenderIconNamePipe,
	GenderEmojiPipe,
	GenderColorPipe,
	SelectedMembersPipe,
	CountryFlagPipe,
	CountryTitle,
];

@NgModule({
	declarations: pipes,
	exports: pipes,
})
export class SneatPipesModule {

}
