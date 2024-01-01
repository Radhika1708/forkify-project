/*
COMPONENTS OF ANY ARCHITECTURE
Business Logic- code that solves the actual business problem
State- essentially stores all the data about the application, UI should be kept in sync with the state
HTTP Library - Responsible for making & recieving AJAX requests
Application Logic- Code that is only concerned about the implementation of application itself
Presentation Logic- concerned about the visible part of application
*/

/*
MVC Architecture
Model - (Business Logic + State + HTTP Library)
Controller - (Application Logic)Bridge b/w model & views   Model & view will exist completely independent from one another
             Main task of MVC is to separate business logic from presentation logic & as a consequence we need something to link them which is controller
View- (Presentation Logic)
*/
