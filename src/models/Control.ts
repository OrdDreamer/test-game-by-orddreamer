export default class Control {

    static initialize(view: HTMLCanvasElement) {
        this.appView = view;
    }


    static addEventListener(eventName: "click" | "mousemove", callback: any) {
        this.appView.addEventListener(eventName, callback);
    }

    static appView: HTMLCanvasElement;

}