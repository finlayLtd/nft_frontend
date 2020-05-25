import React from "react";
import {Link} from "react-router-dom";
import {MarketingButton} from "../styles/Button";
import {Wrapper, FoodElements, SaucePosition, PizzaPosition, TopHero, SubHero, TrustSection, QuoteSection, DetailsSection} from "../styles/Header";
import {sauceFull, pizza} from "../images";
import {logo1 as logo} from "../logos";
import {Flex} from "../styles/Grid";

function Hero({handleLogIn}) {
  return (
    <React.Fragment>
      <TopHero>
        <Wrapper>
          <div style={{paddingTop: 24}}>
            <h1>The path to your next</h1>
            <h2>Open Source</h2>
            <h1>contribution.</h1>
          </div>
          <FoodElements>
            <SaucePosition alt="sauce" src={sauceFull} />
            <PizzaPosition alt="pizza" src={pizza} />
          </FoodElements>
        </Wrapper>
      </TopHero>
      <SubHero>
        <Wrapper>
          <MarketingButton primary onClick={handleLogIn}>
            Login
          </MarketingButton>
          <MarketingButton primary onClick={handleLogIn}>
            Signup
          </MarketingButton>
        </Wrapper>
      </SubHero>
      <TrustSection>
        <small>Trusted By</small>
        <ul>
          <li>GraphQL</li>
          <li>NextJS</li>
          <li>Electron</li>
          <li>Golang</li>
        </ul>
      </TrustSection>
      <QuoteSection>
        <Link to="/">
          <img style={{height: 50}} alt="open sauced" src={logo} />
        </Link>
        <Flex className="description">
          Dictum fusce ut placerat orci nulla pellentesque dignissim. Dictum fusce ut placerat orci nulla pellentesque dignissim. Dictum fusce ut placerat orci nulla pellentesque dignissim. Dictum fusce ut placerat orci nulla pellentesque dignissim.
        </Flex>
        <Flex style={{marginTop: 100}}>
          <Flex>
            <img className="quote-image" alt="open sauced" src={"https://github.com/yg.png"} />
            <span className="quote">
              <q>Dictum fusce ut placerat orci nulla pellentesque dignissim.</q>
              <Flex className="author">- bdougie</Flex>
            </span>
          </Flex>
          <Flex>
            <img className="quote-image" alt="open sauced" src={"https://github.com/yg.png"} />
            <span className="quote">
              <q>Dictum fusce ut placerat orci nulla pellentesque dignissim.</q>
              <Flex className="author">- bdougie</Flex>
            </span>
          </Flex>
        </Flex>
      </QuoteSection>
      <DetailsSection>
        <Flex style={{marginTop: 100, justifyContent: "space-between"}}>
          <Flex>
            <img className="details-image" alt="open sauced" src={"https://github.com/bdougie.png"} />
            <span>
              <span className="details-heading">Dictum fusce ut placerat orci nulla pellentesque dignissim.</span>
              <p className="details-description">Dictum fusce ut placerat orci nulla pellentesque dignissim.</p>
            </span>
          </Flex>
          <Flex>
            <img className="details-image" alt="open sauced" src={"https://github.com/bdougie.png"} />
            <span>
              <span className="details-heading">Dictum fusce ut placerat orci nulla pellentesque dignissim.</span>
              <p className="details-description">Dictum fusce ut placerat orci nulla pellentesque dignissim.</p>
            </span>
          </Flex>
        </Flex>
        <Flex style={{marginTop: 50, justifyContent: "space-between"}}>
          <Flex>
            <img className="details-image" alt="open sauced" src={"https://github.com/bdougie.png"} />
            <span>
              <span className="details-heading">Dictum fusce ut placerat orci nulla pellentesque dignissim.</span>
              <p className="details-description">Dictum fusce ut placerat orci nulla pellentesque dignissim.</p>
            </span>
          </Flex>
          <Flex>
            <img className="details-image" alt="open sauced" src={"https://github.com/bdougie.png"} />
            <span>
              <span className="details-heading">Dictum fusce ut placerat orci nulla pellentesque dignissim.</span>
              <p className="details-description">Dictum fusce ut placerat orci nulla pellentesque dignissim.</p>
            </span>
          </Flex>
        </Flex>
        <Flex style={{marginTop: 50, justifyContent: "space-between"}}>
          <Flex>
            <img className="details-image" alt="open sauced" src={"https://github.com/bdougie.png"} />
            <span>
              <span className="details-heading">Dictum fusce ut placerat orci nulla pellentesque dignissim.</span>
              <p className="details-description">Dictum fusce ut placerat orci nulla pellentesque dignissim.</p>
            </span>
          </Flex>
        </Flex>
      </DetailsSection>
    </React.Fragment>
  );
}

export default Hero;