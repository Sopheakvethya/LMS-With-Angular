import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})
export class CourseDetailComponent implements OnInit {
  course: any;

  dummyCourses = [
    {
      id: 1,
      title: 'Introduction to Angular',
      description:
        'Learn the basics of Angular framework, its core concepts, and how to build a functional web application.',
      duration: 10,
      units: [
        {
          title: 'Unit 1: Introduction to Angular',
          lessons: [
            {
              title: 'Lesson 1.1: Overview of Angular',
              content:
                'Angular is a platform and framework for building single-page client applications using HTML and TypeScript. In this lesson, we’ll cover the evolution of Angular from AngularJS to the current version. We will also discuss the key advantages of using Angular, such as the component-based architecture, two-way data binding, and dependency injection.',
            },
            {
              title: 'Lesson 1.2: Angular Architecture',
              content:
                'Angular applications are made up of components, services, and modules. This lesson explores the high-level architecture of Angular applications, explaining how components interact with templates, how services are used to encapsulate business logic, and the role of modules in organizing the application structure.',
            },
          ],
        },
        {
          title: 'Unit 2: Components in Angular',
          lessons: [
            {
              title: 'Lesson 2.1: Creating Components',
              content:
                'In this lesson, you’ll learn how to create Angular components. We will cover the @Component decorator, how to define metadata for components, and how to bind data using properties and event bindings. We’ll also build our first component and integrate it into an Angular application.',
            },
            {
              title: 'Lesson 2.2: Component Interaction',
              content:
                'Angular applications consist of multiple components that need to communicate with each other. In this lesson, we’ll explore component interaction using Input and Output decorators. We will also discuss using services to enable communication between sibling components.',
            },
          ],
        },
      ],
      quizzes: [
        { id: 1, title: 'Quiz 1: Angular Basics' },
        { id: 2, title: 'Quiz 2: Components in Angular' },
      ],
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      description:
        'Explore advanced JavaScript concepts, modern features, and asynchronous programming techniques to enhance your JavaScript knowledge.',
      duration: 15,
      units: [
        {
          title: 'Unit 1: Advanced Functions',
          lessons: [
            {
              title: 'Lesson 1.1: Closures in JavaScript',
              content:
                'Closures are a core concept in JavaScript, allowing functions to access variables from their outer lexical scope even after the outer function has closed. In this lesson, we’ll dive into how closures work, their practical uses in real-world applications, and common pitfalls to avoid.',
            },
            {
              title: 'Lesson 1.2: Higher-order Functions',
              content:
                'A higher-order function is a function that takes another function as an argument or returns a function as a result. This lesson covers key JavaScript higher-order functions like map(), filter(), and reduce(), and explains how they can be used for functional programming.',
            },
          ],
        },
        {
          title: 'Unit 2: Asynchronous JavaScript',
          lessons: [
            {
              title: 'Lesson 2.1: Promises',
              content:
                'Promises are an essential part of asynchronous programming in JavaScript. In this lesson, we will explore the concept of promises, their states (pending, fulfilled, rejected), and how to chain promises together for better control over asynchronous code. We’ll also look at common patterns such as error handling with .catch().',
            },
            {
              title: 'Lesson 2.2: Async/Await',
              content:
                'Async/Await is a modern syntax for working with asynchronous code in JavaScript, making it easier to write and maintain. This lesson will introduce async functions, how to await promises, and how async/await improves readability over traditional callback-based asynchronous programming.',
            },
          ],
        },
      ],
      quizzes: [
        { id: 3, title: 'Quiz 1: Advanced Functions' },
        { id: 4, title: 'Quiz 2: Asynchronous JavaScript' },
      ],
    },
    {
      id: 3,
      title: 'Mastering TypeScript',
      description:
        'A complete guide to mastering TypeScript, from basics to advanced features like generics, type inference, and decorators.',
      duration: 20,
      units: [
        {
          title: 'Unit 1: Introduction to TypeScript',
          lessons: [
            {
              title: 'Lesson 1.1: What is TypeScript?',
              content:
                'TypeScript is a strongly typed superset of JavaScript that adds static types to the language. In this lesson, we will cover the core concepts of TypeScript, how it integrates with JavaScript, and how type safety improves code reliability and maintainability. We will also set up a TypeScript project and write our first TypeScript file.',
            },
            {
              title: 'Lesson 1.2: Type Annotations',
              content:
                'Type annotations are a powerful feature of TypeScript that allows you to explicitly specify types. This lesson will cover how to add type annotations to variables, functions, and class members, and how TypeScript’s type inference system works to reduce the need for explicit annotations in many cases.',
            },
          ],
        },
        {
          title: 'Unit 2: TypeScript Advanced Features',
          lessons: [
            {
              title: 'Lesson 2.1: Generics',
              content:
                'Generics allow you to create reusable and type-safe components, classes, and functions in TypeScript. In this lesson, we’ll cover the syntax for generics, how to use generic constraints to limit types, and practical examples of generics in real-world applications.',
            },
            {
              title: 'Lesson 2.2: Interfaces and Types',
              content:
                'This lesson delves into the differences between interfaces and types in TypeScript. We’ll cover when to use each, how to extend them, and how to define optional and readonly properties. We’ll also look at practical examples to clarify when one might be preferred over the other.',
            },
          ],
        },
      ],
      quizzes: [
        { id: 5, title: 'Quiz 1: TypeScript Basics' },
        { id: 6, title: 'Quiz 2: Advanced TypeScript' },
      ],
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.course = this.dummyCourses.find((c) => c.id === courseId);
  }

  toggleUnit(index: number) {
    const unitElement = document.getElementById(`unit-${index}`);
    if (unitElement) {
      unitElement.classList.toggle('open');
    }
  }

  toggleLesson(unitIndex: number, lessonIndex: number) {
    const lessonElement = document.getElementById(
      `unit-${unitIndex}-lesson-${lessonIndex}`
    );
    if (lessonElement) {
      lessonElement.classList.toggle('open');
    }
  }

  goBack() {
    this.location.back();
  }

  startQuiz(quizId: number) {
    this.router.navigate([`/quiz/${quizId}`]);
  }
}
