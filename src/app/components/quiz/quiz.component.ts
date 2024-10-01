import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  quiz: any;
  questions: any[] = [];

  dummyQuizzes: { [key: number]: { title: string; questions: { id: number; text: string; options: string[]; }[]; } } = {
    1: {
      title: 'Angular Basics Quiz',
      questions: [
        {
          id: 1,
          text: 'What is Angular?',
          options: ['A front-end framework', 'A database', 'A backend server'],
        },
        {
          id: 2,
          text: 'Which of these is an Angular module?',
          options: ['ngModule', 'ngDatabase', 'ngClass'],
        },
      ],
    },
    2: {
      title: 'Angular Components Quiz',
      questions: [
        {
          id: 1,
          text: 'What is a component in Angular?',
          options: [
            'A UI element',
            'A database element',
            'A server-side element',
          ],
        },
        {
          id: 2,
          text: 'What decorator is used for defining components?',
          options: ['@Component', '@Module', '@Injectable'],
        },
      ],
    },
    // Add more quiz objects here as needed
  };

  answers: any = {};

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    const quizId = Number(this.route.snapshot.paramMap.get('id'));
    this.quiz = this.dummyQuizzes[quizId];
    if (this.quiz) {
      this.questions = this.quiz.questions;
    }
  }

  submitQuiz() {
    console.log(this.answers); // Log answers for now
  }

  goBack() {
    this.location.back();
  }
}
