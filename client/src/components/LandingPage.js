import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { number: '73%', label: 'Workforce dropout after childbirth', icon: '💼' },
    { number: '85%', label: 'Mothers lack childcare access', icon: '🏢' },
    { number: '1:100', label: 'Childcare facility ratio in India', icon: '📊' },
    { number: '42%', label: 'Policy gap in maternal support', icon: '📋' }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Partner with Employers',
      description: 'We collaborate with forward-thinking companies to bring affordable childcare to their workforce',
      icon: '🤝',
      color: '#ff8a80'
    },
    {
      step: '02',
      title: 'AI + Human Care',
      description: 'Advanced technology meets warm human touch for comprehensive child development',
      icon: '💝',
      color: '#ff6b81'
    },
    {
      step: '03',
      title: 'Safe & Nurturing Spaces',
      description: 'Certified facilities designed for play, learning, and rest with love and care',
      icon: '🏡',
      color: '#e8a8ff'
    },
    {
      step: '04',
      title: 'Real-Time Updates',
      description: 'Stay connected with live notifications about your child\'s activities and wellbeing',
      icon: '📱',
      color: '#ffc478'
    }
  ];

  const features = [
    {
      title: 'AI-Assisted Monitoring',
      description: 'Cry detection, sleep tracking, and activity logging powered by intelligent systems',
      icon: '🤖',
      image: '🎯'
    },
    {
      title: 'Certified Caregivers',
      description: 'Trained, loving professionals who treat your child as their own',
      icon: '👩‍🏫',
      image: '❤️'
    },
    {
      title: 'Live Parent Dashboard',
      description: 'Real-time updates, photos, and notifications right on your phone',
      icon: '📊',
      image: '📱'
    },
    {
      title: 'Nutritious Meals',
      description: 'Age-appropriate, hygienic meals planned by child nutrition experts',
      icon: '🍼',
      image: '🥗'
    },
    {
      title: 'Development Activities',
      description: 'Play-based learning, art, music, and age-appropriate curriculum',
      icon: '🎨',
      image: '🎵'
    },
    {
      title: 'Medical Support',
      description: '24/7 medical assistance with pediatrician consultations available',
      icon: '🏥',
      image: '💊'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Senior Software Engineer',
      company: 'Tech Corp India',
      quote: 'ForMa gave me back my career without guilt. Knowing my daughter is happy, safe, and learning makes every workday meaningful.',
      image: '👩‍💼',
      rating: 5
    },
    {
      name: 'Anjali Menon',
      role: 'Marketing Manager',
      company: 'Brand Solutions',
      quote: 'The real-time updates are a game-changer! I can see my son\'s activities and feel connected even during important meetings.',
      image: '👩‍💻',
      rating: 5
    },
    {
      name: 'Lakshmi Reddy',
      role: 'Medical Officer',
      company: 'City Hospital',
      quote: 'As a doctor, I understand the importance of quality care. ForMa exceeded all my expectations with their trained staff and facilities.',
      image: '👩‍⚕️',
      rating: 5
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-emoji">🤱</span>
            <span className="logo-text">ForMa</span>
            <span className="logo-tagline">For Mothers Who Care</span>
          </div>
          <div className="nav-actions">
            <button className="btn-nav" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn-nav-primary" onClick={() => navigate('/register')}>
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pattern"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-headline">
              Every day, mothers face an impossible choice: 
              <span className="highlight"> their career or their child.</span>
            </h1>
            <p className="hero-subheadline">
              ForMa empowers working mothers with AI-assisted, human-touched childcare—
              <strong> so you don't have to choose.</strong>
            </p>
            <div className="hero-buttons">
              <button className="btn-primary-large" onClick={() => navigate('/register')}>
                <span>Join the Movement</span>
                <span className="btn-icon">→</span>
              </button>
              <button className="btn-secondary-large" onClick={() => {
                document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
              }}>
                <span>Learn More</span>
              </button>
            </div>
            <div className="hero-trust-badges">
              <div className="trust-badge">
                <span className="badge-icon">✅</span>
                <span>National Standards Compliant</span>
              </div>
              <div className="trust-badge">
                <span className="badge-icon">🔒</span>
                <span>GDPR Data Safety</span>
              </div>
              <div className="trust-badge">
                <span className="badge-icon">❤️</span>
                <span>Certified Caregivers</span>
              </div>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="illustration-circle">
              <div className="mother-child-emoji">👩‍👧</div>
              <div className="floating-icon icon-1">💕</div>
              <div className="floating-icon icon-2">🌸</div>
              <div className="floating-icon icon-3">✨</div>
              <div className="floating-icon icon-4">🎨</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="problem-section">
        <div className="section-container">
          <h2 className="section-title">The Reality Indian Mothers Face</h2>
          <p className="section-subtitle">These aren't just numbers—they're stories of brilliant women forced to choose</p>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-section">
        <div className="section-container">
          <div className="mission-content">
            <div className="mission-text">
              <span className="mission-label">Our Mission</span>
              <h2 className="mission-title">
                Empowering Working Mothers, One Child at a Time
              </h2>
              <p className="mission-description">
                To empower working mothers by providing <strong>affordable, accessible, and high-quality</strong> AI-assisted, 
                human-touched childcare solutions that enable them to thrive both professionally and personally.
              </p>
              <div className="mission-values">
                <div className="value-item">
                  <span className="value-icon">💝</span>
                  <span className="value-text">Care with Technology & Heart</span>
                </div>
                <div className="value-item">
                  <span className="value-icon">🌟</span>
                  <span className="value-text">Building India's Future Together</span>
                </div>
                <div className="value-item">
                  <span className="value-icon">🚀</span>
                  <span className="value-text">Reducing Workforce Dropout</span>
                </div>
              </div>
            </div>
            <div className="mission-visual">
              <div className="mission-card">
                <div className="card-emoji">🎯</div>
                <h3>Our Vision</h3>
                <p>An India where no mother has to sacrifice her dreams to nurture her child's</p>
              </div>
              <div className="mission-card">
                <div className="card-emoji">💪</div>
                <h3>Our Impact</h3>
                <p>Strengthening families while building professional excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <h2 className="section-title">How ForMa Works</h2>
          <p className="section-subtitle">Simple, seamless, and designed with mothers in mind</p>
          <div className="steps-container">
            {howItWorks.map((step, index) => (
              <div 
                key={index} 
                className={`step-card ${activeStep === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className="step-number" style={{ borderColor: step.color }}>
                  {step.step}
                </div>
                <div className="step-icon" style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)` }}>
                  {step.icon}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Why Mothers Trust ForMa</h2>
          <p className="section-subtitle">Comprehensive care that gives you peace of mind</p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">{feature.icon}</span>
                  <span className="feature-image">{feature.image}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <h2 className="section-title">Stories from Mothers Like You</h2>
          <p className="section-subtitle">Real experiences, real impact</p>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{testimonial.image}</div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role}</p>
                    <p className="testimonial-company">{testimonial.company}</p>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="section-container">
          <h2 className="section-title-alt">The Visionary Behind ForMa</h2>
          <div className="founder-content">
            <div className="founder-image-wrapper">
              <div className="founder-frame">
                <div className="founder-photo">
                  <div className="founder-emoji">👩‍🎓</div>
                </div>
                <div className="floating-credential cred-1">📚</div>
                <div className="floating-credential cred-2">🧬</div>
                <div className="floating-credential cred-3">📊</div>
                <div className="floating-credential cred-4">👶</div>
              </div>
            </div>
            <div className="founder-info">
              <div className="founder-quote-large">
                "I may not be a mother yet, but I've witnessed the silent struggle. 
                The tears in office bathrooms, the missed birthdays, the quiet resignation of brilliant women. 
                <strong> No one should have to choose between career and family. That's why ForMa exists.</strong>"
              </div>
              <div className="founder-details">
                <h3 className="founder-name">Aishwarya Mohan Kayattukandy</h3>
                <p className="founder-title">Founder & Advocate for Working Mothers</p>
                <div className="founder-credentials">
                  <span className="credential-badge">PGDRP - Rural Planning</span>
                  <span className="credential-badge">AIBAS - Biotechnology</span>
                  <span className="credential-badge">Child Development Researcher</span>
                </div>
              </div>
              <div className="founder-story">
                <p>
                  <strong>The Awakening:</strong> During my postgraduate research, I interviewed over 200 working mothers 
                  across India. Their stories weren't just data points—they were heartbreaks. The brilliant engineer who 
                  quit because the creche was too far. The marketing director who missed her daughter's first words during 
                  a client call.
                </p>
                <p>
                  <strong>From Research to Action:</strong> ForMa is where data meets compassion. It's my promise to take 
                  academic research out of papers and into playrooms. To transform policy recommendations into real, warm, 
                  safe spaces.
                </p>
                <p>
                  <strong>A Collective Vision:</strong> This isn't about me creating solutions for mothers. It's about me 
                  learning from mothers to create solutions with them. Every feature in ForMa comes from hours of listening, 
                  every innovation from understanding real needs.
                </p>
              </div>
              <div className="founder-impact">
                <div className="impact-stat">
                  <span className="impact-number">200+</span>
                  <span className="impact-label">Mothers Interviewed</span>
                </div>
                <div className="impact-stat">
                  <span className="impact-number">15+</span>
                  <span className="impact-label">Districts Studied</span>
                </div>
                <div className="impact-stat">
                  <span className="impact-number">100%</span>
                  <span className="impact-label">Heart & Dedication</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Join Us in Shaping a More Inclusive India</h2>
          <p className="cta-subtitle">Together, we can build a future where mothers thrive</p>
          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={() => navigate('/register')}>
              <span className="btn-text">I'm a Mother—Get Support</span>
              <span className="btn-emoji">💝</span>
            </button>
            <button className="cta-btn secondary">
              <span className="btn-text">Partner with Us</span>
              <span className="btn-emoji">🤝</span>
            </button>
            <button className="cta-btn tertiary">
              <span className="btn-text">Start a Pilot at Your Workplace</span>
              <span className="btn-emoji">🏢</span>
            </button>
          </div>
          <div className="cta-partners">
            <p className="partners-label">Trusted By</p>
            <div className="partner-logos">
              <div className="partner-logo">Amity University</div>
              <div className="partner-logo">Tech Corp India</div>
              <div className="partner-logo">Brand Solutions</div>
              <div className="partner-logo">City Hospital</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-emoji">🤱</span>
                <span className="logo-text">ForMa</span>
              </div>
              <p className="footer-tagline">Because every mother deserves to thrive</p>
              <p className="footer-description">
                AI-assisted, human-touched childcare empowering working mothers across India.
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>About</h4>
                <ul>
                  <li><a href="#mission">Our Mission</a></li>
                  <li><a href="#founder">Our Founder</a></li>
                  <li><a href="#impact">Social Impact</a></li>
                  <li><a href="#careers">Careers</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Services</h4>
                <ul>
                  <li><a href="#childcare">Childcare</a></li>
                  <li><a href="#monitoring">AI Monitoring</a></li>
                  <li><a href="#nutrition">Nutrition Plans</a></li>
                  <li><a href="#development">Development Activities</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Partners</h4>
                <ul>
                  <li><a href="#corporate">Corporate Partnerships</a></li>
                  <li><a href="#csr">CSR Collaborations</a></li>
                  <li><a href="#pilot">Start a Pilot</a></li>
                  <li><a href="#franchise">Franchise Opportunities</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <ul>
                  <li><a href="#faq">FAQs</a></li>
                  <li><a href="#contact">Contact Us</a></li>
                  <li><a href="#blog">Blog</a></li>
                  <li><a href="#resources">Resources</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-newsletter">
            <h4>Stay Updated with Loving Tips & Updates</h4>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe 💌</button>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-social">
              <a href="#facebook" className="social-link">📘</a>
              <a href="#instagram" className="social-link">📸</a>
              <a href="#twitter" className="social-link">🐦</a>
              <a href="#linkedin" className="social-link">💼</a>
            </div>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
            <div className="footer-copyright">
              <p>© 2026 ForMa - For Mothers Who Care. All rights reserved.</p>
              <p className="footer-love">Made with 💕 for mothers across India</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
