let days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
let sections = ["1", "2", "3", "4", "5", "6", "7", "8"];
let top_margins = [3.6, 14.65, 25.5, 36.55, 44.43, 59, 74.15, 88.9];
let left_margins = [4.8, 23.8, 43, 62.2, 81.3];
let heights = [10.55, 10.5, 10.62, 7.2, 14.4, 14.65, 10.5];
let widths = [18.1, 18.25, 18.2, 18.1, 18.15];

// Define the blocks data structure
const blocks = {
    Mon: ['A', 'B', 'C', 'Conf', 'D', 'E', 'F', 'Common'],
    Tue: ['D', 'E', 'Pub_Speaking', 'Conf', 'F', 'G', 'A', 'B'],
    Wed: ['G', 'A', 'B', 'C', 'D', 'X'],
    Thu: ['X', 'E', 'F', 'Conf', 'G', 'A', 'B', 'C'],
    Fri: ['C', 'D', 'E', 'F', 'G', 'X']
};

// Create all blocks
Object.entries(blocks).forEach(([day, sections]) => {
    const dayIndex = days.indexOf(day);
    sections.forEach((section, index) => {
        const block = document.createElement('div');
        block.classList.add('block');
        if (dayIndex == 2 && index >= 3) {
            index += 1;
        }
        if (dayIndex == 4 && index >= 2) {
            index += 1;
        }
        if (dayIndex == 4 && index >= 3) {
            index += 1;
        }
        block.dataset.block = `${section}_${day}_${index}`;
        console.log(block.dataset.block);
        block.style.top = top_margins[index] + '%';
        block.style.left = left_margins[dayIndex] + '%';
        block.style.height = heights[index] + '%';
        block.style.width = widths[dayIndex] + '%';
        if (index == 6 && dayIndex == 0) {
            block.style.top = '80.1%';
            block.style.height = '9.4%';
        }
        if (index == 7 && dayIndex == 0) {
            block.style.top = '90%';
            block.style.height = '9.4%';
        }
        if (index == 6 && (dayIndex == 1 || dayIndex == 3)) {
            block.style.height = '14.4%';
        }
        if (index == 7 && (dayIndex == 1 || dayIndex == 3)) {
            block.style.height = '10.6%';
        }
        if (index == 6 && dayIndex == 2) {
            block.style.height = '25.3%';
        }
        if (index == 7 && dayIndex == 4) {
            block.style.top = '85%';
            block.style.height = '14.45%';
        }
        document.getElementById('schedule-wrapper').appendChild(block);
    });
});



// Add click event listeners
document.querySelectorAll('.block').forEach(block => {
    block.addEventListener('click', () => {
        block.classList.toggle('selected');
    
        // Get selected blocks
        const selected = [...document.querySelectorAll('.block.selected')]
            .map(b => b.dataset.block);
    
        console.log("Selected blocks:", selected);
    });
});
