

export class Dimensions {

    public static get footerHeight() { return 64; }
    public static get headerHeight() { return 64; }
    public static get pageContentHeight() { return "calc(100vh - " + (this.footerHeight + this.headerHeight) + "px)" }
    public static get drawerWidth() { return 200; }
}