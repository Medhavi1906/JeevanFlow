import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API = "http://localhost:8080";

  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [savings, setSavings] = useState("");
  const [emi, setEmi] = useState("");

  const [health, setHealth] = useState(null);
  const [explanation, setExplanation] = useState(null);

  const [dropPercentage, setDropPercentage] = useState(30);
  const [simulation, setSimulation] = useState(null);

  const [firstAid, setFirstAid] = useState(null);

  const [userIntent, setUserIntent] = useState("");
  const [mlIntent, setMlIntent] = useState("");
  const [mlConfidence, setMlConfidence] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [lifeEvent, setLifeEvent] = useState("");

  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState(10);
  const [tenureYears, setTenureYears] = useState(5);
  const [loanSimulation, setLoanSimulation] = useState(null);

  // Journey Simulator
  const [journeyAmount, setJourneyAmount] = useState("");
  const [journeyResult, setJourneyResult] = useState(null);
  const [journeyLoading, setJourneyLoading] = useState(false);

  const formatMoney = (value) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const createProfile = async () => {
    const monthlyIncome = Number(income);
    const monthlyExpenses = Number(expenses);
    const monthlySavings = Number(savings);
    const existingEmi = Number(emi);

    if (!monthlyIncome || !monthlyExpenses) {
      alert("Please enter your income and expenses first.");
      return null;
    }

    try {
      const response = await axios.post(`${API}/api/profile`, {
        monthlyIncome,
        monthlyExpenses,
        savings: monthlySavings,
        existingEmi,
        insuranceCoverage: 0,
      });

      return response.data.id;
    } catch (error) {
      console.error(error);

      alert(
        "Could not connect to JeevanFlow backend. Make sure Spring Boot is running."
      );

      return null;
    }
  };

  const calculateHealth = async () => {
    const profileId = await createProfile();

    if (!profileId) return;

    try {
      const response = await axios.get(
        `${API}/api/health/${profileId}`
      );

      const data = response.data;

      setHealth({
        score: Number(data.financialHealthScore || 0),
        risk: data.riskLevel || "N/A",
        disposable: Number(data.disposableIncome || 0),
        dti: Number(data.debtToIncomeRatio || 0),
        runway: Number(data.emergencyRunwayMonths || 0),
        profileId,
      });

      try {
        const explanationResponse = await axios.get(
          `${API}/api/explain/${profileId}`
        );

        setExplanation(explanationResponse.data);
      } catch (error) {
        console.error("Explanation error:", error);
      }
    } catch (error) {
      console.error(error);

      alert(
        "Could not calculate financial health. Make sure Spring Boot is running."
      );
    }
  };

  const loadExplanation = async () => {
    const profileId = health?.profileId;

    if (!profileId) {
      alert("Please calculate your financial health first.");
      return;
    }

    try {
      const response = await axios.get(
        `${API}/api/explain/${profileId}`
      );

      setExplanation(response.data);
    } catch (error) {
      console.error(error);

      alert(
        "Could not load the financial explanation."
      );
    }
  };

  const runIncomeSimulation = async () => {
    if (!income || !expenses) {
      alert("Please enter your financial profile first.");
      return;
    }

    try {
      const profileId = await createProfile();

      if (!profileId) return;

      const response = await axios.get(
        `${API}/api/what-if/income-drop/${profileId}?dropPercentage=${dropPercentage}`
      );

      setSimulation(response.data);
    } catch (error) {
      console.error(error);

      alert(
        "Could not run the simulation. Make sure Spring Boot is running."
      );
    }
  };

  const runLoanSimulation = async () => {
    if (!income || !expenses) {
      alert("Please enter your financial profile first.");
      return;
    }

    if (!loanAmount || Number(loanAmount) <= 0) {
      alert("Please enter a valid loan amount.");
      return;
    }

    try {
      const profileId = await createProfile();

      if (!profileId) return;

      const response = await axios.get(
        `${API}/api/what-if/loan/${profileId}?loanAmount=${Number(
          loanAmount
        )}&interestRate=${Number(
          interestRate
        )}&tenureYears=${Number(tenureYears)}`
      );

      setLoanSimulation(response.data);
    } catch (error) {
      console.error(error);

      alert(
        "Could not run the loan simulation."
      );
    }
  };

  const handleFirstAid = async (emergencyType) => {
    if (!income || !expenses) {
      alert("Please analyze your financial profile first.");
      return;
    }

    try {
      const profileId = await createProfile();

      if (!profileId) return;

      const response = await axios.get(
        `${API}/api/first-aid/${profileId}?emergencyType=${emergencyType}`
      );

      setFirstAid(response.data);
    } catch (error) {
      console.error(error);

      alert(
        "Could not generate the financial safety plan."
      );
    }
  };

  // =========================================================
  // JOURNEY ANALYZER
  // =========================================================

  const analyzeJourney = async () => {
    if (!journeyAmount || Number(journeyAmount) <= 0) {
      alert("Please enter a valid journey amount.");
      return;
    }

    const monthlyIncome = Number(income);
    const monthlyExpenses = Number(expenses);
    const monthlySavings = Number(savings);
    const existingEmi = Number(emi || 0);

    if (!monthlyIncome || !monthlyExpenses) {
      alert("Please enter your financial profile first.");

      document
        .getElementById("health")
        ?.scrollIntoView({
          behavior: "smooth",
        });

      return;
    }

    const intent = mlIntent || lifeEvent;

    if (!intent || intent === "UNCERTAIN") {
      alert(
        "Please analyze your financial situation with the AI Copilot first so JeevanFlow can identify your journey."
      );

      document
        .getElementById("copilot")
        ?.scrollIntoView({
          behavior: "smooth",
        });

      return;
    }

    try {
      setJourneyLoading(true);
      setJourneyResult(null);

      const response = await axios.post(
        `${API}/api/journey/analyze`,
        {
          journeyAmount: Number(journeyAmount),
          monthlyIncome,
          monthlyExpenses,
          monthlySavings,
          existingEmi,
          intent,
        }
      );

      console.log(
        "Journey analysis:",
        response.data
      );

      setJourneyResult(response.data);
    } catch (error) {
      console.error(
        "Journey analysis error:",
        error
      );

      alert(
        "Could not analyze your financial journey. Make sure Spring Boot is running."
      );
    } finally {
      setJourneyLoading(false);
    }
  };

  // =========================================================
  // ML ANALYSIS
  // =========================================================

  const analyzeWithML = async () => {
    if (!userIntent.trim()) {
      alert("Please describe your financial situation.");
      return;
    }

    setMlLoading(true);
    setAiResponse("");
    setMlIntent("");
    setMlConfidence(null);
    setJourneyResult(null);

    try {
      const response = await axios.post(
        `${API}/api/ml/predict`,
        {
          text: userIntent,
        }
      );

      const intent = response.data.intent;

      const confidence = Number(
        response.data.confidence || 0
      );

      setMlIntent(intent);
      setMlConfidence(confidence);

      if (intent === "UNCERTAIN") {
        setAiResponse(
          response.data.message ||
            "I need a little more information to understand your financial situation."
        );

        setLifeEvent("");

        return;
      }

      const intentDescriptions = {
        WEDDING:
          "JeevanFlow detected a Wedding financial journey. You can analyze the expected wedding expense, available savings, funding gap and impact on your financial safety.",

        HOUSE:
          "JeevanFlow detected a Home Purchase financial journey. You can explore the down payment, estimated loan EMI, debt burden and monthly cash-flow impact.",

        EDUCATION:
          "JeevanFlow detected an Education financial journey. You can analyze the education cost, available savings, funding gap and financial impact.",

        JOB_LOSS:
          "JeevanFlow detected a Job Loss financial journey. You can create a financial safety plan based on savings, essential expenses and existing EMI obligations.",

        MEDICAL:
          "JeevanFlow detected a Medical Emergency journey. You can assess emergency savings, insurance protection, essential expenses and financial risk.",

        EXPENSE:
          "JeevanFlow detected an Unexpected Expense journey. You can analyze the effect of the expense on savings and emergency runway.",
      };

      setAiResponse(
        intentDescriptions[intent] ||
          "JeevanFlow detected a change in your financial situation and can help analyze its financial impact."
      );

      setLifeEvent(intent);

      if (intent === "JOB_LOSS") {
        await handleFirstAid("JOB_LOSS");
      }

      if (intent === "MEDICAL") {
        await handleFirstAid("MEDICAL_EMERGENCY");
      }
    } catch (error) {
      console.error(error);

      setAiResponse(
        "JeevanFlow AI could not connect to the ML service. Please make sure Spring Boot and the Python ML service are running."
      );
    } finally {
      setMlLoading(false);
    }
  };

  const score = health
    ? Number(health.score)
    : 0;

  return (
    <div className="app-shell">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="top-nav">

        <div className="brand">

          <div className="brand-icon">
            J
          </div>

          <div>

            <div className="brand-name">
              Jeevan<span>Flow</span>
            </div>

            <div className="brand-subtitle">
              Financial Journey Copilot
            </div>

          </div>

        </div>

        <div className="nav-links">

          <a href="#dashboard">
            Dashboard
          </a>

          <a href="#copilot">
            AI Copilot
          </a>

          <a href="#simulator">
            Simulators
          </a>

          <a href="#first-aid">
            First-Aid
          </a>

        </div>

        <div className="status-pill">
          <span></span>
          AI Online
        </div>

      </nav>


      <main>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          className="hero-section"
          id="dashboard"
        >

          <div className="hero-content">

            <div className="hero-badge">
              ✦ AI-POWERED FINANCIAL JOURNEYS
            </div>

            <h1>
              Your money should adapt
              <br />
              <span>
                when life changes.
              </span>
            </h1>

            <p>
              JeevanFlow helps you understand your financial
              health, explore what-if scenarios and navigate
              unexpected financial situations with explainable AI.
            </p>

            <div className="hero-actions">

              <a
                href="#copilot"
                className="primary-action"
              >
                Start Your Journey →
              </a>

              <a
                href="#health"
                className="secondary-action"
              >
                View Financial Health
              </a>

            </div>

          </div>


          <div className="hero-visual">

            <div className="floating-card card-one">

              <span>
                Financial Health
              </span>

              <strong>
                {health
                  ? `${score}/100`
                  : "—"}
              </strong>

              <small>
                {health
                  ? health.risk
                  : "Analyze profile"}
              </small>

            </div>


            <div className="hero-circle">

              <div className="circle-inner">

                <div className="circle-icon">
                  ₹
                </div>

                <span>
                  Your Journey
                </span>

                <strong>
                  Starts Here
                </strong>

              </div>

            </div>


            <div className="floating-card card-two">

              <span>
                AI Status
              </span>

              <strong>
                ● Ready
              </strong>

              <small>
                Journey analysis active
              </small>

            </div>

          </div>

        </section>


        {/* =====================================================
            AI COPILOT
        ===================================================== */}

        <section
          className="section"
          id="copilot"
        >

          <div className="section-heading">

            <div>

              <span className="section-label">
                INTELLIGENT COPILOT
              </span>

              <h2>
                Tell us what's happening.
              </h2>

              <p>
                JeevanFlow understands your situation and
                identifies the financial journey behind it.
              </p>

            </div>

            <div className="ai-badge">
              🤖 AI Powered
            </div>

          </div>


          <div className="copilot-card">

            <div className="copilot-left">

              <div className="copilot-icon">
                ✦
              </div>

              <h3>
                What is happening in your financial life?
              </h3>

              <p>
                Describe it naturally. You don't need to know
                financial terminology.
              </p>

              <textarea
                value={userIntent}
                onChange={(e) =>
                  setUserIntent(
                    e.target.value
                  )
                }
                placeholder="Example: I need ₹4 lakh for my sister's wedding and I earn ₹50,000 per month..."
              />

              <button
                className="copilot-button"
                onClick={analyzeWithML}
                disabled={mlLoading}
              >
                {mlLoading
                  ? "Understanding your journey..."
                  : "Analyze My Financial Journey →"}
              </button>

            </div>


            <div className="copilot-right">

              <div className="example-title">
                TRY AN EXAMPLE
              </div>

              <button
                className="example-chip"
                onClick={() =>
                  setUserIntent(
                    "I need 4 lakh for my sister's wedding and I earn 50000 per month."
                  )
                }
              >
                💍 Wedding planning
              </button>

              <button
                className="example-chip"
                onClick={() =>
                  setUserIntent(
                    "I am worried about losing my job and have an EMI."
                  )
                }
              >
                💼 Possible job loss
              </button>

              <button
                className="example-chip"
                onClick={() =>
                  setUserIntent(
                    "I need money for a medical emergency."
                  )
                }
              >
                🏥 Medical emergency
              </button>

              <button
                className="example-chip"
                onClick={() =>
                  setUserIntent(
                    "I want to buy a house and need a loan."
                  )
                }
              >
                🏠 Buying a house
              </button>

            </div>

          </div>


          {(mlIntent || aiResponse) && (

            <div className="ai-result">

              <div className="result-header">

                <div>

                  <span className="section-label">
                    AI ANALYSIS
                  </span>

                  <h3>
                    Your financial journey
                  </h3>

                </div>


                {mlConfidence !== null && (

                  <div className="confidence">

                    <span>
                      Confidence
                    </span>

                    <strong>
                      {(mlConfidence * 100).toFixed(1)}%
                    </strong>

                  </div>

                )}

              </div>


              {mlIntent && (

                <div className="journey-detected">

                  <div className="journey-icon">

                    {mlIntent === "WEDDING" && "💍"}
                    {mlIntent === "HOUSE" && "🏠"}
                    {mlIntent === "EDUCATION" && "🎓"}
                    {mlIntent === "JOB_LOSS" && "💼"}
                    {mlIntent === "MEDICAL" && "🏥"}
                    {mlIntent === "EXPENSE" && "💸"}
                    {mlIntent === "UNCERTAIN" && "❓"}

                  </div>

                  <div>

                    <span>
                      DETECTED JOURNEY
                    </span>

                    <strong>
                      {mlIntent.replace("_", " ")}
                    </strong>

                  </div>

                </div>

              )}


              {aiResponse && (

                <p className="ai-message">
                  {aiResponse}
                </p>

              )}

            </div>

          )}

        </section>


        {/* =====================================================
            FINANCIAL PROFILE + HEALTH
        ===================================================== */}

        <section
          className="section"
          id="health"
        >

          <div className="section-heading">

            <div>

              <span className="section-label">
                YOUR MONEY SNAPSHOT
              </span>

              <h2>
                Financial health at a glance.
              </h2>

              <p>
                Add your monthly numbers and JeevanFlow will
                calculate your current financial position.
              </p>

            </div>

          </div>


          <div className="dashboard-grid">

            {/* PROFILE */}

            <div className="profile-panel">

              <div className="panel-header">

                <div className="panel-icon">
                  ₹
                </div>

                <div>

                  <h3>
                    Financial Profile
                  </h3>

                  <span>
                    Tell us about your current finances
                  </span>

                </div>

              </div>


              <div className="form-grid">

                <div className="input-field">

                  <label>
                    Monthly Income
                  </label>

                  <div className="input-wrapper">

                    <span>
                      ₹
                    </span>

                    <input
                      type="number"
                      value={income}
                      placeholder="50,000"
                      onChange={(e) =>
                        setIncome(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>


                <div className="input-field">

                  <label>
                    Monthly Expenses
                  </label>

                  <div className="input-wrapper">

                    <span>
                      ₹
                    </span>

                    <input
                      type="number"
                      value={expenses}
                      placeholder="25,000"
                      onChange={(e) =>
                        setExpenses(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>


                <div className="input-field">

                  <label>
                    Total Savings
                  </label>

                  <div className="input-wrapper">

                    <span>
                      ₹
                    </span>

                    <input
                      type="number"
                      value={savings}
                      placeholder="1,50,000"
                      onChange={(e) =>
                        setSavings(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>


                <div className="input-field">

                  <label>
                    Existing EMI
                  </label>

                  <div className="input-wrapper">

                    <span>
                      ₹
                    </span>

                    <input
                      type="number"
                      value={emi}
                      placeholder="8,000"
                      onChange={(e) =>
                        setEmi(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

              </div>


              <button
                className="main-button"
                onClick={calculateHealth}
              >
                Calculate My Financial Health →
              </button>

            </div>


            {/* HEALTH */}

            <div className="health-panel">

              <div className="panel-header">

                <div className="panel-icon green-icon">
                  ✦
                </div>

                <div>

                  <h3>
                    Financial Health
                  </h3>

                  <span>
                    Your current financial snapshot
                  </span>

                </div>

              </div>


              {!health ? (

                <div className="health-empty">

                  <div className="empty-circle">
                    ✦
                  </div>

                  <h3>
                    Ready to analyze
                  </h3>

                  <p>
                    Enter your financial details to see
                    your personalized health score.
                  </p>

                </div>

              ) : (

                <div className="health-content">

                  <div className="score-area">

                    <div
                      className="score-ring"
                      style={{
                        background:
                          `conic-gradient(#257a52 ${score * 3.6}deg, #e8eee9 0deg)`
                      }}
                    >

                      <div className="score-inner">

                        <strong>
                          {score.toFixed(0)}
                        </strong>

                        <span>
                          /100
                        </span>

                      </div>

                    </div>


                    <div className="score-info">

                      <span className="score-label">
                        OVERALL HEALTH
                      </span>

                      <h3>
                        {health.risk === "LOW"
                          ? "You're on track"
                          : health.risk === "MODERATE"
                          ? "Needs attention"
                          : "Action recommended"}
                      </h3>

                      <div
                        className={`health-risk ${health.risk.toLowerCase()}`}
                      >
                        {health.risk} RISK
                      </div>

                    </div>

                  </div>


                  <div className="health-metrics">

                    <div className="metric-card">

                      <span>
                        Disposable Income
                      </span>

                      <strong>
                        ₹{formatMoney(
                          health.disposable
                        )}
                      </strong>

                      <div className="metric-bar">

                        <div
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                (health.disposable /
                                  Number(income || 1)) *
                                  100
                              )
                            )}%`,
                          }}
                        ></div>

                      </div>

                    </div>


                    <div className="metric-card">

                      <span>
                        Debt-to-Income
                      </span>

                      <strong>
                        {health.dti.toFixed(1)}%
                      </strong>

                      <div className="metric-bar">

                        <div
                          style={{
                            width: `${Math.min(
                              100,
                              health.dti
                            )}%`,
                          }}
                        ></div>

                      </div>

                    </div>


                    <div className="metric-card">

                      <span>
                        Emergency Runway
                      </span>

                      <strong>
                        {health.runway.toFixed(1)}
                        <small>
                          {" "}months
                        </small>
                      </strong>

                      <div className="metric-bar">

                        <div
                          style={{
                            width: `${Math.min(
                              100,
                              health.runway * 10
                            )}%`,
                          }}
                        ></div>

                      </div>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        </section>


        {/* =====================================================
            SIMULATORS
        ===================================================== */}

        <section
          className="section"
          id="simulator"
        >

          <div className="section-heading">

            <div>

              <span className="section-label">
                WHAT-IF ENGINE
              </span>

              <h2>
                Explore before you decide.
              </h2>

              <p>
                See how major financial changes could affect
                your monthly cash flow.
              </p>

            </div>

          </div>


          <div className="simulator-grid">

            {/* INCOME DROP */}

            <div className="simulator-card">

              <div className="simulator-icon purple">
                ↘
              </div>

              <div className="card-tag">
                INCOME SCENARIO
              </div>

              <h3>
                What if your income drops?
              </h3>

              <p>
                Simulate a sudden income reduction and see
                how your disposable income and debt burden change.
              </p>


              <div className="slider-box">

                <div className="slider-label">

                  <span>
                    Income reduction
                  </span>

                  <strong>
                    {dropPercentage}%
                  </strong>

                </div>

                <input
                  type="range"
                  min="10"
                  max="70"
                  step="5"
                  value={dropPercentage}
                  onChange={(e) =>
                    setDropPercentage(
                      Number(e.target.value)
                    )
                  }
                />

              </div>


              <button
                className="outline-button"
                onClick={runIncomeSimulation}
              >
                Run Simulation →
              </button>


              {simulation && (

                <div className="simulation-output">

                  <div>

                    <span>
                      New Income
                    </span>

                    <strong>
                      ₹{formatMoney(
                        simulation.simulatedIncome
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Disposable
                    </span>

                    <strong>
                      ₹{formatMoney(
                        simulation.simulatedDisposableIncome
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      DTI
                    </span>

                    <strong>
                      {Number(
                        simulation.simulatedDebtToIncomeRatio
                      ).toFixed(1)}%
                    </strong>

                  </div>


                  <div
                    className={`health-risk ${(simulation.riskLevel || "LOW").toLowerCase()}`}
                  >
                    {simulation.riskLevel} RISK
                  </div>

                </div>

              )}

            </div>


            {/* LOAN */}

            <div className="simulator-card">

              <div className="simulator-icon orange">
                ₹
              </div>

              <div className="card-tag">
                LOAN SCENARIO
              </div>

              <h3>
                What if you take a new loan?
              </h3>

              <p>
                Understand the EMI, debt burden and monthly
                cash-flow impact before taking on new debt.
              </p>


              <div className="loan-inputs">

                <div className="mini-input">

                  <label>
                    Loan Amount
                  </label>

                  <div>

                    <span>
                      ₹
                    </span>

                    <input
                      type="number"
                      value={loanAmount}
                      placeholder="5,00,000"
                      onChange={(e) =>
                        setLoanAmount(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>


                <div className="mini-input">

                  <label>
                    Interest %
                  </label>

                  <div>

                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) =>
                        setInterestRate(
                          Number(e.target.value)
                        )
                      }
                    />

                    <span>
                      %
                    </span>

                  </div>

                </div>


                <div className="mini-input">

                  <label>
                    Years
                  </label>

                  <div>

                    <input
                      type="number"
                      value={tenureYears}
                      onChange={(e) =>
                        setTenureYears(
                          Number(e.target.value)
                        )
                      }
                    />

                  </div>

                </div>

              </div>


              <button
                className="outline-button"
                onClick={runLoanSimulation}
              >
                Calculate Loan Impact →
              </button>


              {loanSimulation && (

                <div className="simulation-output">

                  <div>

                    <span>
                      New EMI
                    </span>

                    <strong>
                      ₹{formatMoney(
                        loanSimulation.newLoanEmi
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Total EMI
                    </span>

                    <strong>
                      ₹{formatMoney(
                        loanSimulation.totalEmi
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      DTI
                    </span>

                    <strong>
                      {Number(
                        loanSimulation.debtToIncomeRatio
                      ).toFixed(1)}%
                    </strong>

                  </div>


                  <div
                    className={`health-risk ${(loanSimulation.riskLevel || "LOW").toLowerCase()}`}
                  >
                    {loanSimulation.riskLevel} RISK
                  </div>

                </div>

              )}

            </div>

          </div>


          {/* =====================================================
              JOURNEY PLANNER
          ===================================================== */}

          <div className="journey-planner-card">

            <div className="journey-planner-header">

              <div>

                <span className="section-label">
                  AI JOURNEY PLANNER
                </span>

                <h3>
                  Turn your situation into a financial plan.
                </h3>

                <p>
                  Use the journey detected by the AI Copilot and
                  your financial profile to calculate the funding
                  gap, timeline and cash-flow impact.
                </p>

              </div>

              <div className="journey-planner-icon">
                ✦
              </div>

            </div>


            <div className="journey-planner-form">

              <div className="input-field">

                <label>
                  Required Journey Amount
                </label>

                <div className="input-wrapper">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={journeyAmount}
                    placeholder="4,00,000"
                    onChange={(e) =>
                      setJourneyAmount(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>


              <div className="journey-detected-mini">

                <span>
                  Detected Journey
                </span>

                <strong>
                  {mlIntent &&
                  mlIntent !== "UNCERTAIN"
                    ? mlIntent.replace(
                        "_",
                        " "
                      )
                    : "Analyze with AI first"}
                </strong>

              </div>


              <button
                className="main-button"
                onClick={analyzeJourney}
                disabled={journeyLoading}
              >
                {journeyLoading
                  ? "Analyzing your journey..."
                  : "Analyze Journey →"}
              </button>

            </div>


            {journeyLoading && (

              <div className="journey-loading">

                <div className="empty-circle">
                  ✦
                </div>

                <p>
                  JeevanFlow is calculating your
                  financial journey...
                </p>

              </div>

            )}


            {journeyResult &&
              !journeyLoading && (

                <div className="journey-result">

                  <div className="result-header">

                    <div>

                      <span className="section-label">
                        JOURNEY ANALYSIS
                      </span>

                      <h3>
                        {journeyResult.intent
                          ? journeyResult.intent.replace(
                              "_",
                              " "
                            )
                          : "Financial Journey"}
                      </h3>

                    </div>


                    <div
                      className={`health-risk ${(journeyResult.riskLevel || "LOW").toLowerCase()}`}
                    >
                      {journeyResult.riskLevel ||
                        "N/A"}{" "}
                      RISK
                    </div>

                  </div>


                  <div className="journey-metrics">

                    <div className="metric-card">

                      <span>
                        Goal Amount
                      </span>

                      <strong>
                        ₹{formatMoney(
                          journeyResult.journeyAmount
                        )}
                      </strong>

                    </div>


                    <div className="metric-card">

                      <span>
                        Available Savings
                      </span>

                      <strong>
                        ₹{formatMoney(
                          journeyResult.monthlySavings
                        )}
                      </strong>

                    </div>


                    <div className="metric-card">

                      <span>
                        Funding Gap
                      </span>

                      <strong>
                        ₹{formatMoney(
                          journeyResult.fundingGap
                        )}
                      </strong>

                    </div>


                    <div className="metric-card">

                      <span>
                        Disposable Income
                      </span>

                      <strong>
                        ₹{formatMoney(
                          journeyResult.disposableIncome
                        )}
                      </strong>

                    </div>

                  </div>


                  <div className="journey-result-details">

                    <div>

                      <span>
                        Estimated Timeline
                      </span>

                      <strong>
                        {Number(
                          journeyResult.monthsToGoal ||
                            0
                        ).toFixed(2)}{" "}
                        months
                      </strong>

                    </div>


                    <div>

                      <span>
                        EMI Impact
                      </span>

                      <strong>
                        {Number(
                          journeyResult.emiImpact ||
                            0
                        ).toFixed(1)}
                        %
                      </strong>

                    </div>

                  </div>


                  <div className="journey-insight">

                    <span>
                      JEEVANFLOW INSIGHT
                    </span>

                    <p>
                      {journeyResult.message ||
                        "Your journey analysis has been completed."}
                    </p>

                  </div>


                  <div className="journey-recommendation">

                    <span>
                      PLANNING GUIDANCE
                    </span>

                    <p>
                      {journeyResult.recommendation ||
                        "Review the funding gap and cash-flow impact before making a financial commitment."}
                    </p>

                  </div>

                </div>

              )}

          </div>

        </section>


        {/* =====================================================
            FIRST AID
        ===================================================== */}

        <section
          className="section"
          id="first-aid"
        >

          <div className="emergency-banner">

            <div>

              <span className="section-label">
                FINANCIAL FIRST-AID
              </span>

              <h2>
                When life gets difficult,
                <br />
                know your next financial step.
              </h2>

              <p>
                Choose what you're facing and JeevanFlow
                will generate a structured financial safety plan.
              </p>

            </div>


            <div className="emergency-icon">
              🚑
            </div>

          </div>


          <div className="aid-grid">

            <button
              className="aid-card"
              onClick={() =>
                handleFirstAid(
                  "JOB_LOSS"
                )
              }
            >

              <span>
                💼
              </span>

              <strong>
                Job Loss
              </strong>

              <small>
                Protect your cash flow
              </small>

            </button>


            <button
              className="aid-card"
              onClick={() =>
                handleFirstAid(
                  "MEDICAL_EMERGENCY"
                )
              }
            >

              <span>
                🏥
              </span>

              <strong>
                Medical Emergency
              </strong>

              <small>
                Manage emergency expenses
              </small>

            </button>


            <button
              className="aid-card"
              onClick={() =>
                handleFirstAid(
                  "EMI_STRESS"
                )
              }
            >

              <span>
                💳
              </span>

              <strong>
                EMI Stress
              </strong>

              <small>
                Handle repayment pressure
              </small>

            </button>


            <button
              className="aid-card"
              onClick={() =>
                handleFirstAid(
                  "FINANCIAL_CRISIS"
                )
              }
            >

              <span>
                ⚠️
              </span>

              <strong>
                Financial Crisis
              </strong>

              <small>
                Stabilize your finances
              </small>

            </button>

          </div>


          {firstAid && (

            <div className="first-aid-result">

              <div className="result-header">

                <div>

                  <span className="section-label">
                    SAFETY PLAN
                  </span>

                  <h3>
                    Your financial first-aid plan
                  </h3>

                </div>


                <div
                  className={`health-risk ${(firstAid.riskLevel || "LOW").toLowerCase()}`}
                >
                  {firstAid.riskLevel} RISK
                </div>

              </div>


              <div className="aid-summary">

                <div>

                  <span>
                    Emergency Runway
                  </span>

                  <strong>
                    {Number(
                      firstAid.emergencyRunwayMonths ||
                        0
                    ).toFixed(1)}{" "}
                    months
                  </strong>

                </div>


                <div>

                  <span>
                    Essential Monthly Need
                  </span>

                  <strong>
                    ₹{formatMoney(
                      firstAid.monthlyEssentialNeed
                    )}
                  </strong>

                </div>

              </div>


              <h4>
                Recommended Actions
              </h4>


              <div className="action-list">

                {(firstAid.recommendedActions || [])
                  .map(
                    (action, index) => (

                      <div
                        className="action-item"
                        key={index}
                      >

                        <div>
                          {index + 1}
                        </div>

                        <p>
                          {action}
                        </p>

                      </div>

                    )
                  )}

              </div>

            </div>

          )}

        </section>


        {/* =====================================================
            EXPLAINABLE AI
        ===================================================== */}

        <section className="section">

          <div className="explain-section">

            <div className="explain-intro">

              <div className="explain-icon">
                💡
              </div>

              <span className="section-label">
                EXPLAINABLE AI
              </span>

              <h2>
                Don't just get an answer.
                <br />
                Understand why.
              </h2>

              <p>
                JeevanFlow shows the factors and assumptions
                behind your financial assessment.
              </p>

              <button
                className="main-button"
                onClick={loadExplanation}
              >
                Explain My Financial Health →
              </button>

            </div>


            {explanation ? (

              <div className="explanation-panel">

                <div className="why-card">

                  <span>
                    WHY THIS ASSESSMENT?
                  </span>

                  <p>
                    {explanation.assumptions?.[0] ||
                      "The assessment uses your financial profile and current obligations."}
                  </p>

                </div>


                <div className="factor-section">

                  <h3>
                    Key Factors
                  </h3>

                  {(explanation.keyFactors || [])
                    .map(
                      (factor, index) => (

                        <div
                          className="factor"
                          key={index}
                        >

                          <div className="factor-check">
                            ✓
                          </div>

                          <p>
                            {factor}
                          </p>

                        </div>

                      )
                    )}

                </div>


                <div className="explanation-stats">

                  <div>

                    <span>
                      Risk Level
                    </span>

                    <strong>
                      {explanation.riskLevel}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Debt-to-Income
                    </span>

                    <strong>
                      {Number(
                        explanation.debtToIncomeRatio ||
                          0
                      ).toFixed(1)}%
                    </strong>

                  </div>


                  <div>

                    <span>
                      Emergency Runway
                    </span>

                    <strong>
                      {Number(
                        explanation.emergencyRunwayMonths ||
                          0
                      ).toFixed(1)}{" "}
                      months
                    </strong>

                  </div>

                </div>


                <div className="assumptions">

                  <h3>
                    Assumptions
                  </h3>

                  {(explanation.assumptions || [])
                    .map(
                      (assumption, index) => (

                        <div
                          className="assumption"
                          key={index}
                        >

                          <span>
                            i
                          </span>

                          <p>
                            {assumption}
                          </p>

                        </div>

                      )
                    )}

                </div>

              </div>

            ) : (

              <div className="explanation-empty">

                <div>
                  ◎
                </div>

                <h3>
                  Your explanation will appear here
                </h3>

                <p>
                  Calculate your financial health first,
                  then explore why JeevanFlow reached its assessment.
                </p>

              </div>

            )}

          </div>

        </section>


        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section className="features-section">

          <div className="feature-box">

            <div>
              🤖
            </div>

            <span>
              01
            </span>

            <h3>
              Understand
            </h3>

            <p>
              AI identifies what financial journey you're facing.
            </p>

          </div>


          <div className="feature-box">

            <div>
              🔮
            </div>

            <span>
              02
            </span>

            <h3>
              Simulate
            </h3>

            <p>
              Explore possible future scenarios before acting.
            </p>

          </div>


          <div className="feature-box">

            <div>
              🛡️
            </div>

            <span>
              03
            </span>

            <h3>
              Protect
            </h3>

            <p>
              Get structured actions when financial stress appears.
            </p>

          </div>


          <div className="feature-box">

            <div>
              💡
            </div>

            <span>
              04
            </span>

            <h3>
              Explain
            </h3>

            <p>
              Understand the factors and assumptions behind every result.
            </p>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="footer-brand">

          <div className="brand-icon">
            J
          </div>

          <div>

            <strong>
              JeevanFlow
            </strong>

            <span>
              Intelligent Financial Journey Copilot
            </span>

          </div>

        </div>

        <p>
          When life changes, your financial plan changes.
        </p>

        <span className="footer-copy">
          © 2026 JeevanFlow AI
        </span>

      </footer>

    </div>
  );
}

export default App;