const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    { id: 1, name: "Declare a Variable", due_at: "2023-01-25", points_possible: 50 },
    { id: 2, name: "Write a Function", due_at: "2023-02-27", points_possible: 150 },
    { id: 3, name: "Code the World", due_at: "3156-11-15", points_possible: 500 }
  ]
};

function validateCourseGroup(course, ag) {
  console.log(`Checking: AssignmentGroup.course_id (${ag.course_id}) vs CourseInfo.id (${course.id})`);
 
  if (typeof course.id !== "number" || typeof ag.course_id !== "number") {
    throw new Error("Course ID and AssignmentGroup course_id must be numbers.");
  }
  if (ag.course_id !== course.id) {
    throw new Error(
      `Invalid input: AssignmentGroup ${ag.id} does not belong to course ${course.id}.`
    );
  }
  console.log("Validation passed — the assignment group belongs to this course.");
}


function buildAssignmentMap(assignments) {
  console.log("\n========== STEP 2: BUILD ASSIGNMENT MAP ==========");
  const map = {};
  for (const a of assignments) {
    console.log(`\nProcessing assignment ${a.id}: "${a.name}"`);
    const points = Number(a.points_possible);
    if (isNaN(points) || points <= 0) {
      console.warn(`  ✗ Skipped: invalid points_possible (${a.points_possible}).`);
      continue;
    }
    map[a.id] = { ...a, points_possible: points };
    console.log(`  ✓ Added to map: due ${a.due_at}, worth ${points} points.`);
  }
  console.log("\nFinal assignment map keys:", Object.keys(map));
  return map;
}
 