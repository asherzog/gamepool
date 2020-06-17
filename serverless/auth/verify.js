const jwt = require('jsonwebtoken')

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {}
  authResponse.principalId = principalId
  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }
  return authResponse
}

exports.auth = async (event, context) => {
  // check header or url parameters or post parameters for token
  const token = event.authorizationToken.split("Bearer ")[1]

  if (!token) {
    return context.fail("Unauthorized")
  }
  // verifies secret and checks exp
  jwt.verify(token, process.env.API_KEY, (err, decoded) => {
    if (err) {
      console.log("err: ", err)
      return context.fail("Unauthorized")
    }
    // if everything is good, save to request for use in other routes
    return context.succeed(generatePolicy(decoded.id, 'Allow', '*'))
  })

};