import { request, gql } from 'graphql-request'
import sanitizedConfig from '../../config';
import { confirmEmailError, invalidLogin } from './errorMessages';
import { User } from '../../entity/User';
import { createTypeormConn, createTypeormDisConn } from '../../utils/createTypeormConn';

const email = "alan080378962440@gmail.com";
const password = "dgfjkjkkl";

const RegsiterMutation = (e: string, p: string) => gql`
  mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
  }`;

const loginMutation = (e: string, p: string) => gql`
  mutation {
    login(email: "${e}", password: "${p}") {
      path
      message
    }
  }`;

beforeAll(async () => {
    await createTypeormConn()
});
                                                                                                                                                       
afterAll(async () => {
    await createTypeormDisConn();
})


const loginExpectError = async (e: string, p: string, errMsg: string) => {
  const response = await request(sanitizedConfig.TEST_HOST as string, loginMutation(e, p))
  console.log(response)

        expect(response).toEqual({
            login: [{
                path: "email",
                message: errMsg
            }]
        })
}

describe("login", () => {
    test("email not found in database", async () => {
        await loginExpectError("bob@dbob.com", "bob12345", invalidLogin)
    })

    test("Email not confirmed", async () => { 
        await request(sanitizedConfig.TEST_HOST as string, RegsiterMutation(email, password))

        await loginExpectError(email, password, confirmEmailError)

        await User.update({ confirmed: true }, { email })
        await loginExpectError(email, "sedfsdfjofd", invalidLogin)
    })
}) 