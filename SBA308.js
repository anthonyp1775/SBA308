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
  const map = {};
  for (const a of assignments) {
    console.log(`\nProcessing assignment ${a.id}: "${a.name}"`);
    const points = Number(a.points_possible);
    if (isNaN(points) || points <= 0) {
      console.warn(`Skipped: invalid points_possible (${a.points_possible}).`);
      continue;
    }
    map[a.id] = { ...a, points_possible: points };
    console.log(`Added to map: due ${a.due_at}, worth ${points} points.`);
  }
  console.log("\nFinal assignment map keys:", Object.keys(map));
  return map;
}
 
function isNotYetDue(assignment, now = new Date()) {
  return new Date(assignment.due_at) > now;
}
 
function isLate(submission, assignment) {
  return new Date(submission.submitted_at) > new Date(assignment.due_at);
}

function processSubmissions(submissions, assignmentMap) {
  const learners = {};
 
  for (const entry of submissions) {
    console.log(`\nSubmission: learner ${entry.learner_id}, assignment ${entry.assignment_id}`);
    try {
      const assignment = assignmentMap[entry.assignment_id];
      if (!assignment) {
        console.log("Skipped: assignment not found in map (unknown or invalid).");
        continue;
      }
      if (isNotYetDue(assignment)) {
        console.log(`Skipped: not due yet (due ${assignment.due_at}).`);
        continue;
      }
 
      let score = Number(entry.submission.score);
      if (isNaN(score)) {
        console.warn(`Skipped: score "${entry.submission.score}" is not a number.`);
        continue;
      }
      console.log(`Raw score: ${score} / ${assignment.points_possible}`);
 
      if (isLate(entry.submission, assignment)) {
        const penalty = assignment.points_possible * 0.1;
        score -= penalty;
        console.log(`LATE (submitted ${entry.submission.submitted_at}, due ${assignment.due_at}).`);
        console.log(`Penalty: -${penalty} points → adjusted score: ${score}`);
      } else {
        console.log("On time — no penalty.");
      }
 
      if (!learners[entry.learner_id]) {
        console.log(`  Creating new record for learner ${entry.learner_id}.`);
        learners[entry.learner_id] = {
          id: entry.learner_id,
          totalScore: 0,
          totalPossible: 0,
          scores: {}
        };
      }
 
      const learner = learners[entry.learner_id];
      learner.totalScore += score;
      learner.totalPossible += assignment.points_possible;
      learner.scores[assignment.id] = score / assignment.points_possible;
 
      console.log(`Percentage for assignment ${assignment.id}: ${score} / ${assignment.points_possible} = ${(score / assignment.points_possible).toFixed(4)}`);
      console.log(`Running totals for learner ${learner.id}: ${learner.totalScore} earned / ${learner.totalPossible} possible`);
    } catch (err) {
      console.warn(`Skipped malformed submission: ${err.message}`);
    }
  }
 
  return learners;
}
 
function formatResults(learners) {
  const results = [];
  for (const key in learners) {
    const l = learners[key];
    const formatted = {
      id: l.id,
      avg: l.totalPossible > 0 ? l.totalScore / l.totalPossible : 0
    };
    console.log(`\nLearner ${l.id}: avg = ${l.totalScore} / ${l.totalPossible} = ${formatted.avg}`);
    for (const assignmentId in l.scores) {
      formatted[assignmentId] = l.scores[assignmentId];
      console.log(`  Assignment ${assignmentId}: ${l.scores[assignmentId].toFixed(4)}`);
    }
    results.push(formatted);
  }
  return results;
}