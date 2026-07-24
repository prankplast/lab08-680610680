import { Router, type Request, type Response } from "express";
import {
  zEnrollmentBody,
  zStudentId,
  zCourseId,
} from "../libs/zodValidators.js";

import type { Enrollment, Course, Student } from "../libs/types.js";

// import database
import { courses, enrollments, students } from "../db/db.js";
import { int, string } from "zod";

const router = Router();

// GET /api/v1/enrollments
router.get("/", (req: Request, res: Response) => {
  try {
    const courseId = req.query.courseNo;
    const student_Id = req.query.studentId;

    if ((courseId && student_Id) || (!courseId && !student_Id)) {
        return res.status(400).json({
          ok: false,
          message: "Please provide either studentId or CourseNo and not both!",
        });
    }

    if (courseId) {
      const parseResult = zCourseId.safeParse(courseId);

      if (!parseResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: parseResult.error.issues[0]?.message,
        });
      }

      const foundEnrollments: Enrollment[] = enrollments.filter((e: Enrollment) => e.courseId == courseId);
      let students1: Student[] = [];

      if (foundEnrollments.length === 0) {
        return res.status(404).json({
          ok: false,
          message: `Enrollment for course ${courseId} does not exist`,
        });
      }

      for (const enrollment of foundEnrollments) {
        const student = students.find(
          (s) => s.studentId === enrollment.studentId
        );

        if (!student) continue;
        students1.push(student);
      }

      if (students1.length > 0) {
        return res.status(200).json({
          ok: true,
          students: students1,
        });
      }
      else{
        return res.status(404).json({
          ok: false,
          message: "Student is missing.",
        });
      }
    }

    if (student_Id) {
      const parseResult = zStudentId.safeParse(student_Id);

      if (!parseResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: parseResult.error.issues[0]?.message,
        });
      }

      const foundEnrollments: Enrollment[] = enrollments.filter((e: Enrollment) => e.studentId == student_Id);
      let courses1: Course[] = [];

      if (foundEnrollments.length === 0) {
        return res.status(404).json({
          ok: false,
          message: `Enrollment for course ${courseId} does not exist`,
        });
      }

      for (const enrollment of foundEnrollments) {
        const course = courses.find(
          (c) => c.courseId === enrollment.courseId
        );

        if (!course) continue;
        courses1.push(course);
      }

      if (courses1.length > 0) {
        return res.status(200).json({
          ok: true,
          courses: courses1,
        });
      }
      else{
        return res.status(404).json({
          ok: false,
          message: "Course is missing.",
        });
      }
    }

  } catch (err) {
    return res.status(200).json({
      ok: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

export default router;
