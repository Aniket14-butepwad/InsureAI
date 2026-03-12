import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Insurance Made Smart & Simple</h1>
        <p>
          Compare top insurance policies instantly using AI-powered insights.
        </p>

        <div className="hero-input">
          <button
            className="btn-primary"
            onClick={() => navigate('/view-plans')}
          >
            View Plans
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;

