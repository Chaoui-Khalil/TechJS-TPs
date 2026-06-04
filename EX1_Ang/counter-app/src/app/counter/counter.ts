import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  templateUrl: './counter.html',
  styleUrls: ['./counter.css']
})
export class Counter {

  number: number = 0;

  increment() {
    this.number++;
  }

  decrement() {
    this.number--;
  }

  reset() {
    this.number = 0;
  }
}