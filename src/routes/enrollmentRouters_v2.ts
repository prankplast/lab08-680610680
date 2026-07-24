import { Router, type Request, type Response } from "express";
import {
  zEnrollmentBody,
  zStudentId,
  zCourseId,
} from "../libs/zodValidators.js";

import type { Enrollment, Course, Student } from "../libs/types.js";

// import database
import { courses, enrollments, students } from "../db/db.js";
import { int } from "zod";

const router = Router();

// DELETE /api/v2/enrollments
router.delete("/", (request: Request, response: Response) => {
	let course_Id = Number(request.body.courseId) 

	const enrollmentBody = {
		studentId: request.body.studentId,
		courseId: course_Id,
	}
	
	const parseResult = zEnrollmentBody.safeParse(enrollmentBody);
	
	if (!parseResult.success) {
		return response.status(400).json({
			ok: false,
			message: parseResult .error.issues[0]?.message,
		});
	}

	const { studentId, courseId } = enrollmentBody;
	const foundIndex = enrollments.findIndex((e: Enrollment) => e.studentId === studentId && e.courseId == courseId);
	
	if (foundIndex === -1) {
		return response.status(404).json({
			ok: false,
			message: "Enrollment does not exist",
		});
	}

	enrollments.splice(foundIndex, 1);
	
	return response.status(200).json({
		ok: true,
		message: "Enrollment has been deleted"
	});
	
});

export default router;
