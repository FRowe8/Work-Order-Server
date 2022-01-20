const request = require("supertest");

const app = require("../src/app");

describe("GET /api/v1", () => {
  it("responds with a json message", (done) => {
    request(app)
      .get("/api/v1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        {
          message: "API - 👋🌎🌍🌏",
        },
        done
      );
  });
});

describe("GET /api/v1/jobDetails", () => {
  it("responds with a json message", (done) => {
    request(app)
      .post("/api/v1/jobDetails")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, ["😀", "😳", "🙄"], done);
  });
});
