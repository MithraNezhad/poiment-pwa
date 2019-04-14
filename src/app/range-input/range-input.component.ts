import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from "@angular/core";
import * as _ from "underscore";
@Component({
  selector: "app-range-input",
  templateUrl: "./range-input.component.html",
  styleUrls: ["./range-input.component.less"]
})
export class RangeInputComponent implements OnInit {
  @Input() xAxisStep = 1;
  @Input() xAxisTick = 0.5;
  @Input() possibleRanges = [[7, 12], [14, 16]];
  @Output() modelChange = new EventEmitter();

  // @Input() model = [[8.5, 12], [14, 16]];
  private _model: any;


  public get model(): any {
    return this._model;
  }

  @Input()

  public set model(v: any) {
    if (this._model !== v) {
      console.log(v);
      this._model = v;
      this.changeRef.detectChanges();

    }
  }

  @Input() xAxis;

  mousedownOn: any;
  mousedownPos: { x: any; y: any };
  xAxisStepWidth: number;
  constructor(private changeRef: ChangeDetectorRef) {
    // changeRef.detach();
  }

  @Input() pointerLabelFn = (input: number) => input;
  trackByFn(index: any, item: any) {
    return index;
  }

  vibrate(pattern: number | number[]) {
    if (navigator.vibrate) {
      setTimeout(() => {
        navigator.vibrate(pattern);
      }, 1);
    }
  }

  ngOnInit() {
    if (
      !this.xAxis &&
      this.possibleRanges &&
      typeof this.possibleRanges[0] !== "undefined"
    ) {
      this.xAxis = _.range(
        this.possibleRanges[0][0],
        this.possibleRanges[this.possibleRanges.length - 1][1] + 1,
        this.xAxisStep
      ).reduce((prev: any, current) => {
        prev.push(current);

        for (
          let i = 1;
          i <= Math.floor(this.xAxisStep / this.xAxisTick / 2);
          i++
        ) {
          //  prev.push((prev[prev.length - 1] || current) + (this.xAxisStep / this.xAxisTick) * i);
          prev.push(current + this.xAxisTick * i);
        }

        return prev;
      }, []);
    }
    this.changeRef.detectChanges();

    this.xAxisStepWidth = document.querySelector(".axis .step").clientWidth;

    document
      .querySelector(".axis")
      .addEventListener("mousedown", (event: any) => {
        const elem = event.target;

        if (elem.classList.contains("pointer")) {
          this.mousedownOn = parseFloat(
            elem.attributes.getNamedItem("data-position").value
          );
          this.mousedownPos = { x: event.clientX, y: event.clientY };

          this.vibrate(50);

          this.changeRef.detectChanges();
        }
      });

    document
      .querySelector(".axis")
      .addEventListener("touchstart", (event: any) => {
        const elem = event.target;

        if (elem.classList.contains("pointer")) {
          this.mousedownOn = parseFloat(
            elem.attributes.getNamedItem("data-position").value
          );

          this.mousedownPos = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
          };

          this.vibrate(50);

          this.changeRef.detectChanges();
        }
      });

    document.addEventListener("mouseup", () => {
      this.mousedownOn = null;
      this.mousedownPos = null;
      this.changeRef.detectChanges();
    });

    document.addEventListener("touchend", () => {
      this.mousedownOn = null;
      this.mousedownPos = null;
      this.changeRef.detectChanges();
    });

    const moveFn = event => {
      if (this.mousedownOn != null) {
        const diff =
          this.mousedownPos.x -
          (event.touches ? event.touches[0].clientX : event.clientX);

        //  console.log(event, diff, diff > this.xAxisStepWidth * this.xAxisTick);

        if (diff > this.xAxisStepWidth * this.xAxisTick) {
          this.model = this.model.map((item, index) => {
            if (item[0] === this.mousedownOn) {
              if (
                this.model.filter((v, i) => {
                  return i !== index && v[1] === item[0] - this.xAxisTick;
                }).length === 0
              ) {
                item[0] -= this.xAxisTick;
                this.mousedownOn = item[0];
                this.vibrate(10);
              }
            }
            if (item[1] === this.mousedownOn) {
              if (item[0] < item[1] - this.xAxisTick) {
                item[1] -= this.xAxisTick;
                this.mousedownOn = item[1];
                this.vibrate(10);
              }
            }
            return item;
          });

          this.mousedownPos = {
            x: event.touches ? event.touches[0].clientX : event.clientX,
            y: event.touches ? event.touches[0].clientY : event.clientY
          };
        }

        if (diff < this.xAxisStepWidth * this.xAxisTick * -1) {
          this.model = this.model.map((item, index) => {
            if (item[0] === this.mousedownOn) {
              if (item[1] > item[0] + this.xAxisTick) {
                item[0] += this.xAxisTick;
              }
              this.mousedownOn = item[0];
              this.vibrate(10);
            }
            if (item[1] === this.mousedownOn) {
              if (
                this.model.filter((v, i) => {
                  return i !== index && v[0] === item[1] + this.xAxisTick;
                }).length === 0
              ) {
                item[1] += this.xAxisTick;
              }
              this.mousedownOn = item[1];
              this.vibrate(10);
            }
            return item;
          });

          this.mousedownPos = {
            x: event.touches ? event.touches[0].clientX : event.clientX,
            y: event.touches ? event.touches[0].clientY : event.clientY
          };
        }

        this.changeRef.detectChanges();
      }
    };
    document.addEventListener("mousemove", moveFn);

    document.addEventListener("touchmove", moveFn);
  }
}
