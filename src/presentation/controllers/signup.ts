import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParameterError } from '../error/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParameterError } from '../error/invalid-param-error'
import { ServerError } from '../error/server-error'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    try {
      const requiredFields = ['name', 'email','password','passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) { return badRequest(new MissingParameterError(field)) }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!isValid) {
        return badRequest(new InvalidParameterError('email'))
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
