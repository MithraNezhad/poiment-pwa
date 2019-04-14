import { Component, OnInit, ChangeDetectorRef, Input } from "@angular/core";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.less"]
})
export class CreateComponent implements OnInit {
  constructor(private changeRef: ChangeDetectorRef) {}

  model: {
    name?: string;
    date?: Date;
    description?: string;
    ranges?: number[][];
  } = {
    date: new Date(),
    ranges: [[9, 15]]
  };

  possibleRanges = [[7, 24]];
  pointerLabelFn = (input: number) =>
    input
      .toString()
      .split(".")[0]
      .padStart(2, "0") +
    ":" +
    // tslint:disable-next-line:semicolon
    ((input - parseInt(input.toString(), 10)) * 60).toString().padStart(2, "0");

  deleteRange(i) {
    this.model.ranges = this.model.ranges.filter((v, index) => index !== i);
    this.changeRef.detectChanges();
  }
  newRange() {
    for (let i = 0; i < 24; i++) {
      if (
        this.possibleRanges.filter(p => p[0] <= i && p[1] >= i).length !== 0 &&
        this.model.ranges.filter(p => p[0] <= i && p[1] >= i).length === 0 &&
        this.model.ranges.filter(p => p[0] <= i + 2 && p[1] >= i + 2).length ===
          0
      ) {
        this.model.ranges = this.model.ranges.concat([[i, i + 2]]);
        break;
      }
    }

    this.changeRef.detectChanges();
  }
  ngOnInit() {}
}
