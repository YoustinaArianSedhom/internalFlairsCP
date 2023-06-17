import { NgModule } from '@angular/core';
import { ArrayFromSizePipe } from './array-from-size.pipe';
import { ToNumberPipe } from './to-number.pipe';
import { CapitalizePipe } from './capitalize.pipe';
import { SafeHtmlPipe } from './safeHtml';
import { DateAgoPipe } from './date-ago.pipe';
import { SecsToMinsPipe } from './secs-to-mins.pipe';
import { RoundNumberPipe } from './round-number.pipe';
import { NAReplacerPipe } from './na-replacer.pipe';


@NgModule({
    imports: [],
    exports: [ArrayFromSizePipe, ToNumberPipe, CapitalizePipe, SafeHtmlPipe, DateAgoPipe, SecsToMinsPipe, RoundNumberPipe,
        NAReplacerPipe],
    declarations: [ArrayFromSizePipe, 
        ToNumberPipe, CapitalizePipe, SafeHtmlPipe, DateAgoPipe, SecsToMinsPipe, RoundNumberPipe, NAReplacerPipe],
    providers: [],
})
export class PipesModule { }
