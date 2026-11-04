import request from "supertest";

// API
import app from "../../server-test";

export function mockBasicModelOperations(model, modelDataTest) {
    jest.spyOn(model, "findOne").mockReturnValue({
        exec: jest.fn().mockResolvedValue(model(modelDataTest))
    });
    jest.spyOn(model.prototype, "save").mockResolvedValue({});
}

export function mockQueryResult(model, method, returnValue ) {
    jest.spyOn(model, method).mockReturnValue({
        exec: jest.fn().mockResolvedValue(returnValue)
    })
}

export async function postUserReq(reqInfo, requestBody, responseType = "body") {
    const res = await request(app).post(reqInfo.url)
        .send(requestBody).expect(reqInfo.status);

    expect(res[responseType]).toEqual(reqInfo.expectedResponse);
}