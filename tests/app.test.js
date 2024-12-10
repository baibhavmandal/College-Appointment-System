const request = require("supertest");
const mongoose = require("mongoose");
const server = require("../server.js");
const connectDB = require("../config/db.js");

describe("Complete workflow test", () => {
  let professorCookie, studentACookie, studentBCookie, studentAappointmentid;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    console.log("Mongoose Connection State:", mongoose.connection.readyState);

    const loginProfessorResponse = await request(server)
      .post("/api/v1/auth/professor")
      .send({
        email: "john.doe@example.com",
        password: "hashed_password_1",
      });

    expect(loginProfessorResponse.status).toBe(200);
    expect(loginProfessorResponse.body.success).toBe(true);

    professorCookie = loginProfessorResponse.headers["set-cookie"][0];

    console.log("Professor P1 authenticated successfully.");

    const loginStudentAResponse = await request(server)
      .post("/api/v1/auth/student")
      .send({
        email: "priti.mandal@example.com",
        password: "hashed_password_1",
      });

    expect(loginStudentAResponse.status).toBe(200);
    expect(loginStudentAResponse.body.success).toBe(true);

    studentACookie = loginStudentAResponse.headers["set-cookie"][0];

    console.log("Student A1 authenticated successfully.");

    const loginStudentBResponse = await request(server)
      .post("/api/v1/auth/student")
      .send({
        email: "baibhav.mandal@example.com",
        password: "hashed_password_2",
      });

    expect(loginStudentBResponse.status).toBe(200);
    expect(loginStudentBResponse.body.success).toBe(true);

    studentBCookie = loginStudentBResponse.headers["set-cookie"][0];

    console.log("Student A2 authenticated successfully.");
  });

  afterAll(async () => {
    server.close();
    await mongoose.connection.close();
  });

  it("Professor P1 adds available slots", async () => {
    const response = await request(server)
      .post("/api/v1/professor/slot/allotfreeslots")
      .set("Cookie", professorCookie)
      .send([
        {
          date: "2024-12-12T09:00:00Z",
          times: ["09:00 - 09:30", "12:00 - 13:00"],
        },
      ]);

    expect(response.status).toBe(200);
  });

  it("Student A1 views available time slots for Professor P1", async () => {
    const response = await request(server)
      .post("/api/v1/student/slot/checkfreeslot")
      .set("Cookie", studentACookie)
      .send({
        professor_id: "6756cc859e05a7705eb24825",
      });

    expect(response.status).toBe(200);
  });

  it("Student A1 books an appointment with Professor P1 for time T1", async () => {
    const response = await request(server)
      .post("/api/v1/student/appointments/request")
      .set("Cookie", studentACookie)
      .send({
        professor_id: "6756cc859e05a7705eb24825",
        date: "2024-12-12",
        start_time: "09:00",
        end_time: "09:30",
      });

    const { _id } = response.body;
    studentAappointmentid = _id;

    expect(response.status).toBe(200);
  });

  it("Student A2 books an appointment with Professor P1 for time T2", async () => {
    const response = await request(server)
      .post("/api/v1/student/appointments/request")
      .set("Cookie", studentBCookie)
      .send({
        professor_id: "6756cc859e05a7705eb24825",
        date: "2024-12-12",
        start_time: "12:00",
        end_time: "13:00",
      });

    expect(response.status).toBe(200);
  });

  it("Professor P1 cancels the appointment with Student A1", async () => {
    const response = await request(server)
      .post("/api/v1/professor/appointments/accept")
      .set("Cookie", professorCookie)
      .send({
        appointment_id: studentAappointmentid,
        status: "declined",
      });

    expect(response.status).toBe(200);
  });

  it("Student A1 checks their appointments and realizes they do not have any pending appointments", async () => {
    const response = await request(server)
      .get("/api/v1/student/appointments/status")
      .set("Cookie", studentACookie);

    expect(response.status).toBe(200);
  });
});
