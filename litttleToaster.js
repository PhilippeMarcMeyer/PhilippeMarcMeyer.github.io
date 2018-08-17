
// shows a little message for a given duration 
/*
        var toast = new LittleToaster("parentToaster", "messageSucces", onParent); // init
        toast.text("You are warned !"); // set text
        toast.moveAt(200, 600); // set an absolute position
        toast.showFor(4000); // disapear after 4s
 */
function LittleToaster(htmlZone, toastId) {
    if (!toastId) toastId = "littleToasterMsg";
    this.style = "display:none;z-index:5000;position:absolute;padding:4px;color:white;background-color:rgba(90, 90, 90, 0.7);border-radius:2px;text-align:center;padding: 15px 10px 15px 10px;border: 1px solid #555; vertical-align: middle;width:300px;box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);"
    this.html = "<div id='" + toastId + "' style='" + this.style + "'></div>";
    this.Pointer = document.getElementById(htmlZone);

    this.ToastPtr = null;
    if (this.Pointer) {
        this.Pointer.innerHTML = this.html;
        if (this.Pointer.querySelectorAll) {
            this.ToastPtr = this.Pointer.querySelectorAll("#" + toastId)[0];
        } else {
            this.ToastPtr = document.getElementById(toastId);
        }
    }
    // We need to stay absolute
    if (this.ToastPtr) {
        this.ToastPtr.style.position = "absolute";
    }
    // ------- methods
    this.hide = function () {
        if (this.ToastPtr) {
            this.ToastPtr.style.display = "none";
        }
    }
    this.show = function () {
        if (this.ToastPtr) {
            this.ToastPtr.style.display = "block";
        }
    }
    // If you don't move and dont provide a style left and top attribute in the style parametre
    // then without moveAt the toast will appear at its relative position
    // If you use moveAt, location is absolute 
    this.moveAt = function (x, y) {
        var w = document.body.offsetWidth;
        if (x < 0) x = 0;
        if (x > w - 300) x = w - 300;

        if (this.ToastPtr) {
            this.ToastPtr.style.left = 0;
            this.ToastPtr.style.top = 0;
            this.ToastPtr.style.marginLeft = x + "px";
            this.ToastPtr.style.marginTop = y + "px";
        }
    }
    // fires a timer to hide the toest
    this.showFor = function (millisecs,callBack) {
        if (this.ToastPtr) {
            this.ToastPtr.style.display = "block";
            var self = this;
            this.ToastPtr.addEventListener("click", function (event) {
                self.hide();
                if (callBack) callBack();
                event.preventDefault();
            });
            setTimeout(function () {
                self.hide();
                if (callBack) callBack();

            }, millisecs);

        }
    }
    // set the text (you can use html)
    this.text = function (text) {
        if (this.ToastPtr) {
            this.ToastPtr.innerHTML = text;
        }
    }
}
