
package xebicon.prometheus

import io.gatling.core.Predef._
import io.gatling.http.Predef._

import scala.concurrent.duration._

class XebiconSimulation extends Simulation {

  val httpProtocol = http
    .baseUrl("http://localhost:8081") // Here is the root for all relative URLs

  val scn = scenario("BasicScenario") // A scenario is a chain of requests and pauses
    .exec(http("get")
    .get("/api/hello"))
    .pause(1) // Note that Gatling has recorder real time pauses


  val userPerSec = 2
  val constantPartDuration = 5 seconds
  val pauseDuration = 5 seconds
  val maxUsers = 20
  val rampDuration = 1 minute

  val constantUsersBlock = List(constantUsersPerSec(2) during constantPartDuration, nothingFor(pauseDuration))


  val injections =
    constantUsersBlock ++
      constantUsersBlock ++
      constantUsersBlock :+
      (rampUsersPerSec(1) to maxUsers during rampDuration)


  setUp(scn.inject(injections
  ).protocols(httpProtocol))
}