import { isMobile } from './Utils';

export default class Settings {
    public static mobile: boolean = isMobile();
    public static highQuality: boolean = false;
    public static speed: number = 1;
    public static color: number = 6; // White
}
