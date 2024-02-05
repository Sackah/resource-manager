import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css',
})
export class StarRatingComponent implements OnInit {
  @Input() numberOfStars = 5;
  @Output() ratingchange = new EventEmitter<number>();
  rating = 0;
  hoverIndex = 0;

  stars: number[] = [];

  ngOnInit() {
    for (let i = 0; i < this.numberOfStars; i++) {
      this.stars.push(i);
    }
  }

  rate(rating: number) {
    this.rating = rating;
    this.ratingchange.emit(rating);
    console.log(rating);
  }

  hover(index: number) {
    this.hoverIndex = index;
  }

  leave() {
    this.hoverIndex = 0;
  }
}
