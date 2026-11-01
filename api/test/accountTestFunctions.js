import request from "supertest";

// API
import app from "../../server-test";

// Modelos
import { Supplier, Client } from "../models/models";

const model = Object.freeze({
    supplier: Supplier,
    client: Client
})

export function mockUserModel(type, modelDataTest) {
    jest.spyOn(model[type], "findOne").mockReturnValue({
        exec: jest.fn().mockResolvedValue(model[type](modelDataTest))
    });
    jest.spyOn(model[type].prototype, "save").mockResolvedValue({});
}

export async function postUserReq(reqInfo, requestBody, responseType = "body") {
    const res = await request(app).post(reqInfo.url)
        .send(requestBody).expect(reqInfo.status);

    expect(res[responseType]).toEqual(reqInfo.expectedResponse);
}