#!/usr/bin/env python3
"""
Task Analysis Script
Fetches tasks from the API and generates basic insights.
"""

import sys
import json
from datetime import datetime
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

# API configuration
API_URL = "http://localhost:5000/api/tasks"


def fetch_tasks():
    """Fetch all tasks from the API."""
    # Using urllib instead of requests to avoid external dependencies
    try:
        request = Request(API_URL, headers={"Content-Type": "application/json"})
        with urlopen(request, timeout=10) as response:
            data = json.loads(response.read().decode())
            return data.get("data", [])
    except HTTPError as e:
        print(f"ERROR HTTP: {e.code} - {e.reason}", file=sys.stderr)
        sys.exit(1)
    except URLError as e:
        print(f"ERROR de red: {e.reason}", file=sys.stderr)
        print("   Asegúrate de que la API esté corriendo en http://localhost:5000", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError:
        print("ERROR: Respuesta JSON inválida de la API", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"ERROR inesperado: {str(e)}", file=sys.stderr)
        sys.exit(1)


def analyze_tasks(tasks):
    """Analyze tasks and generate insights."""
    total_tasks = len(tasks)
    
    print("\n" + "=" * 50)
    print("TASK ANALYSIS REPORT")
    print("=" * 50 + "\n")
    
    # Total tasks
    print(f"Total de tareas: {total_tasks}")
    
    if total_tasks == 0:
        print("\n   No hay tareas registradas aún.")
        return
    
    # Find next due date
    upcoming_tasks = []
    now = datetime.utcnow()  # Use UTC to match API dates
    
    for task in tasks:
        if task.get("due"):
            try:
                # Parse ISO 8601 date (MongoDB stores in UTC)
                due_str = task["due"].replace("Z", "+00:00")
                due_date = datetime.fromisoformat(due_str)
                
                # Remove timezone info for comparison (both are UTC)
                if due_date.tzinfo:
                    due_date = due_date.replace(tzinfo=None)
                
                # Consider dates that haven't passed yet
                if due_date >= now:
                    upcoming_tasks.append({
                        "title": task["title"],
                        "due": due_date
                    })
            except (ValueError, TypeError) as e:
                # Skip tasks with invalid dates
                continue
    
    if upcoming_tasks:
        # Sort by due date
        upcoming_tasks.sort(key=lambda x: x["due"])
        next_task = upcoming_tasks[0]
        
        print(f"\nPróximo vencimiento:")
        print(f"   Tarea: {next_task['title']}")
        print(f"   Fecha: {next_task['due'].strftime('%d/%m/%Y')}")
        
        # Calculate time until due (using UTC midnight as reference)
        # Add 1 day minus 1 second to consider the full day
        due_end_of_day = next_task['due'].replace(hour=23, minute=59, second=59)
        time_until = due_end_of_day - now
        days_until = time_until.days
        hours_until = time_until.seconds // 3600
        minutes_until = (time_until.seconds % 3600) // 60
        total_hours = int(time_until.total_seconds() // 3600)
        
        if total_hours < 1:
            # Less than 1 hour
            print(f"   ADVERTENCIA: Vence en {minutes_until} minutos!")
        elif total_hours < 24:
            # Less than 24 hours
            if hours_until == 0 and minutes_until > 0:
                print(f"   ADVERTENCIA: Vence en {minutes_until} minutos!")
            elif minutes_until > 0:
                print(f"   ADVERTENCIA: Vence en {hours_until}h {minutes_until}min!")
            else:
                print(f"   ADVERTENCIA: Vence en {hours_until} horas!")
        elif days_until == 0 or days_until == 1:
            print(f"   ADVERTENCIA: Vence mañana")
        else:
            print(f"   En {days_until} días")
    else:
        print("\nPróximo vencimiento: Sin fechas programadas")
    
    # Additional stats
    tasks_with_due = sum(1 for task in tasks if task.get("due"))
    print(f"\nTareas con fecha límite: {tasks_with_due} de {total_tasks}")
    
    print("\n" + "=" * 50 + "\n")


def main():
    """Main execution function."""
    print("\nObteniendo tareas de la API...")
    
    try:
        tasks = fetch_tasks()
        analyze_tasks(tasks)
    except KeyboardInterrupt:
        print("\n\nProceso interrumpido por el usuario")
        sys.exit(0)


if __name__ == "__main__":
    main()
