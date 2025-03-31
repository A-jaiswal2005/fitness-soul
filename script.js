async function fetchExercisePlan() {
    try {
        document.getElementById('exerciseContent').innerHTML = "Loading...";

        const response = await fetch('http://localhost:3000/exercise-plan');
        const data = await response.json();

        if (data.error) {
            document.getElementById('exerciseContent').innerHTML = `<p>Error: ${data.error}</p>`;
            return;
        }

        // Format JSON into a table
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        // Table Header
        const headerRow = table.insertRow();
        const headers = ['Day', 'Focus', 'Exercises', 'Notes'];
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            header.style.border = '1px solid #ddd';
            header.style.padding = '8px';
            header.style.textAlign = 'left';
            headerRow.appendChild(header);
        });

        // Table Rows
        for (const day in data.workoutPlan.days) {
            const dayData = data.workoutPlan.days[day];
            const row = table.insertRow();

            const dayCell = row.insertCell();
            dayCell.textContent = day;
            dayCell.style.border = '1px solid #ddd';
            dayCell.style.padding = '8px';

            const focusCell = row.insertCell();
            focusCell.textContent = dayData.focus;
            focusCell.style.border = '1px solid #ddd';
            focusCell.style.padding = '8px';

            const exercisesCell = row.insertCell();
            exercisesCell.innerHTML = dayData.exercises.map(exercise => {
                return `<div>${exercise.name} (Sets: ${exercise.sets}, Reps: ${exercise.reps}, Notes: ${exercise.notes})</div>`;
            }).join('');
            exercisesCell.style.border = '1px solid #ddd';
            exercisesCell.style.padding = '8px';

            const notesCell = row.insertCell();
            notesCell.textContent = dayData.notes;
            notesCell.style.border = '1px solid #ddd';
            notesCell.style.padding = '8px';
        }

        document.getElementById('exerciseContent').innerHTML = ''; // Clear existing content
        document.getElementById('exerciseContent').appendChild(table);

    } catch (error) {
        console.error("Error fetching exercise plan:", error);
        document.getElementById('exerciseContent').innerHTML = "Error fetching data. Please try again later.";
    }
}