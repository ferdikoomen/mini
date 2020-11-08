import Settings from './Settings';

export default class ControlsSelectQuality {
    private static selected: boolean = false;
    private static elementLow: HTMLElement;
    private static elementHigh: HTMLElement;
    private static elementGo: HTMLElement;

    public static wait(): Promise<void> {
        return new Promise<void>((resolve: () => void): void => {
            this.elementLow = document.getElementById('controls-quality-low')!;
            this.elementHigh = document.getElementById('controls-quality-high')!;
            this.elementGo = document.getElementById('controls-quality-go')!;

            this.elementLow.className = 'show';
            this.elementHigh.className = 'show';
            this.elementLow.addEventListener('click', () => this.select(false, resolve), false);
            this.elementHigh.addEventListener('click', () => this.select(true, resolve), false);
        });
    }

    private static select(highQuality: boolean, resolve: () => void): void {
        if (!this.selected) {
            this.selected = true;
            this.elementLow.className = '';
            this.elementHigh.className = '';
            this.elementGo.className = '';
            Settings.highQuality = highQuality;
            resolve();
        }
    }
}
