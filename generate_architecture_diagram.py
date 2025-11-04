#!/usr/bin/env python3
"""
Smart Coach System Architecture Diagram Generator
Generates a system architecture diagram using diagrams library
"""

from diagrams import Diagram, Cluster, Edge
from diagrams.onprem.client import Users
from diagrams.onprem.container import Docker
from diagrams.onprem.database import Postgresql
from diagrams.programming.framework import React, Spring
from diagrams.programming.language import Java, Javascript
from diagrams.generic.storage import Storage
from diagrams.generic.compute import Rack

def generate_architecture():
    with Diagram("Smart Coach System Architecture", show=False, direction="TB", 
                graph_attr={"splines": "ortho", "nodesep": "0.8", "ranksep": "1.2", "pad": "0.5"}):
        # Users
        users = Users("Users")
        
        # Frontend Cluster
        with Cluster("Frontend Layer (React - Port 3000)", graph_attr={"margin": "15"}):
            react_app = React("React App")
            
            with Cluster("Authentication", graph_attr={"margin": "10"}):
                auth_context = Javascript("Auth Context\n(JWT Storage)")
                login_page = Javascript("Login Page")
                signup_page = Javascript("SignUp Page")
            
            with Cluster("Components", graph_attr={"margin": "10", "nodesep": "0.6"}):
                dashboard = Javascript("Dashboard\nPage")
                goals = Javascript("Goals\nPage")
                workouts = Javascript("Workouts\nPage")
                diet = Javascript("Diet Planner\nPage")
                profile = Javascript("Profile\nPage")
            
            with Cluster("API Client", graph_attr={"margin": "10"}):
                api_service = Javascript("API Service\n(HTTP Client)")
                auth_interceptor = Javascript("Auth Interceptor\n(JWT Headers)")
                mock_api = Javascript("Mock API\n(Development)")
        
        # Backend Cluster
        with Cluster("Backend Layer (Spring Boot - Port 8080)", graph_attr={"margin": "15"}):
            spring_app = Spring("Spring Boot API\n(REST Endpoints)")
            
            with Cluster("Authentication", graph_attr={"margin": "10"}):
                jwt_filter = Java("JWT Filter\n(Token Validation)")
                auth_ctrl = Java("Auth Controller\n(/login, /register)")
                token_service = Java("Token Service\n(JWT Generation)")
            
            with Cluster("Controllers", graph_attr={"margin": "10", "nodesep": "0.6"}):
                goal_ctrl = Java("Goal\nController")
                workout_ctrl = Java("Workout\nController")
                meal_ctrl = Java("Meal\nController")
                user_ctrl = Java("User\nController")
                dashboard_ctrl = Java("Dashboard\nController")
            
            with Cluster("Services", graph_attr={"margin": "10"}):
                nutrition_service = Java("Nutrition\nService")
            
            with Cluster("Repositories", graph_attr={"margin": "10", "nodesep": "0.6"}):
                user_repo = Java("User\nRepository")
                goal_repo = Java("Goal\nRepository")
                workout_repo = Java("Workout\nRepository")
                meal_repo = Java("Meal\nRepository")
        
        # Database Cluster
        with Cluster("Database Layer (PostgreSQL - Port 5432)", graph_attr={"margin": "20"}):
            docker_db = Docker("Docker Container")
            postgres = Postgresql("PostgreSQL")
            
            with Cluster("Entity Schema", graph_attr={"margin": "15", "nodesep": "1.0", "ranksep": "1.5"}):
                user_entity = Storage("User Entity\n\n• userId (PK)\n• fullName\n• email\n• password\n• dateOfBirth\n• height\n• weight\n• profilePictureUrl")
                
                goal_entity = Storage("Goal Entity\n\n• goalId (PK)\n• userId (FK)\n• type (ENUM)\n• title\n• description\n• targetValue\n• currentValue\n• targetDate\n• status (ENUM)")
                
                workout_entity = Storage("Workout Entity\n\n• workoutId (PK)\n• userId (FK)\n• date\n• distance\n• avgHeartRate\n• calories\n• location\n• weatherTemp\n• weatherHumidity")
                
                meal_entity = Storage("Meal Entity\n\n• mealId (PK)\n• userId (FK)\n• type\n• date\n• food\n• calories\n• protein\n• carbs\n• fat")
        
        # Frontend Authentication Flow
        users >> Edge(label="Login/Register", color="red") >> [login_page, signup_page]
        [login_page, signup_page] >> Edge(label="Credentials", color="red") >> auth_context
        
        # Frontend App Flow
        users >> Edge(label="App Access", color="blue") >> react_app
        react_app >> auth_context
        auth_context >> [dashboard, goals, workouts, diet, profile]
        
        # API Client Flow
        [dashboard, goals, workouts, diet, profile] >> api_service
        auth_context >> Edge(label="JWT Token", color="purple") >> auth_interceptor
        auth_interceptor >> api_service
        api_service >> mock_api
        
        # Backend Authentication Flow
        api_service >> Edge(label="Auth Requests\n/api/auth/*", color="red") >> auth_ctrl
        api_service >> Edge(label="Protected API\nwith JWT", color="green") >> jwt_filter
        jwt_filter >> Edge(label="Token\nValidation", color="purple") >> token_service
        jwt_filter >> spring_app
        
        # Backend API Connections
        spring_app >> [goal_ctrl, workout_ctrl, meal_ctrl, user_ctrl, dashboard_ctrl]
        auth_ctrl >> Edge(label="Generate\nJWT", color="purple") >> token_service
        
        # Service Layer
        meal_ctrl >> Edge(color="orange") >> nutrition_service
        
        # Repository Layer
        auth_ctrl >> Edge(color="gray") >> user_repo
        user_ctrl >> Edge(color="gray") >> user_repo
        goal_ctrl >> Edge(color="gray") >> goal_repo
        workout_ctrl >> Edge(color="gray") >> workout_repo
        meal_ctrl >> Edge(color="gray") >> meal_repo
        dashboard_ctrl >> Edge(color="gray") >> [user_repo, goal_repo, workout_repo, meal_repo]
        
        # Database Connections
        [user_repo, goal_repo, workout_repo, meal_repo] >> Edge(label="JPA/Hibernate\nSQL Queries", color="black") >> postgres
        docker_db >> Edge(label="Container\nManagement", color="darkgray") >> postgres
        
        # Entity Relationships
        postgres >> [user_entity, goal_entity, workout_entity, meal_entity]
        
        # Foreign Key Relationships
        user_entity >> Edge(label="1:N\ngoals", style="dashed", color="darkblue") >> goal_entity
        user_entity >> Edge(label="1:N\nworkouts", style="dashed", color="darkgreen") >> workout_entity
        user_entity >> Edge(label="1:N\nmeals", style="dashed", color="darkorange") >> meal_entity

if __name__ == "__main__":
    try:
        generate_architecture()
        print("✅ Enhanced architecture diagram generated as 'smart_coach_system_architecture.png'")
        print("📊 Improved layout with better spacing and clearer entity relationships")
    except Exception as e:
        print(f"❌ Error generating diagram: {e}")
        print("💡 Make sure 'diagrams' library is installed: pip install diagrams")