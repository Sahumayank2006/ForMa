import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: '73%', label: 'Workforce dropout after childbirth', icon: '💼', color: '#ff6b6b' },
    { number: '85%', label: 'Mothers lack childcare access', icon: '🏢', color: '#feca57' },
    { number: '1:100', label: 'Childcare facility ratio in India', icon: '📊', color: '#48dbfb' },
    { number: '42%', label: 'Policy gap in maternal support', icon: '📋', color: '#ff9ff3' }
  ];

  const values = [
    { 
      icon: '🕉️', 
      title: 'Cultural Values',
      subtitle: 'Indian Traditions',
      description: 'Respecting Indian traditions while embracing modern parenting'
    },
    { 
      icon: '🪷', 
      title: 'Values & Care',
      subtitle: 'Sanskaar',
      description: 'Teaching cultural values along with smart development'
    },
    { 
      icon: '🎵', 
      title: 'Indian Music',
      subtitle: 'Regional Languages',
      description: 'Lullabies, rhymes, and songs in your mother tongue'
    },
    { 
      icon: '🥘', 
      title: 'Home-Style Food',
      subtitle: 'Traditional Cuisine',
      description: 'Traditional, nutritious meals your child will love'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Partner with Employers',
      subtitle: 'Corporate Collaboration',
      description: 'We work with progressive companies to bring affordable childcare right to your workplace',
      icon: '🤝',
      color: '#ff6b6b',
      details: ['Corporate tie-ups', 'Subsidized rates', 'Convenient locations']
    },
    {
      step: '02',
      title: 'AI + Human Care',
      subtitle: 'Technology Meets Love',
      description: 'Smart technology combined with the warmth of experienced caregivers',
      icon: '💝',
      color: '#feca57',
      details: ['24/7 monitoring', 'Trained professionals', 'Personalized attention']
    },
    {
      step: '03',
      title: 'Safe & Nurturing Spaces',
      subtitle: 'Certified Facilities',
      description: 'Certified facilities designed for your child\'s growth, safety, and happiness',
      icon: '🏡',
      color: '#48dbfb',
      details: ['CCTV coverage', 'Hygienic spaces', 'Age-appropriate activities']
    },
    {
      step: '04',
      title: 'Real-Time Updates',
      subtitle: 'Stay Connected',
      description: 'Stay connected with instant notifications about your little one\'s day',
      icon: '📱',
      color: '#ff9ff3',
      details: ['Photo updates', 'Activity logs', 'Direct communication']
    }
  ];

  const features = [
    {
      title: 'AI-Powered Monitoring',
      description: 'Cry detection, sleep tracking, and intelligent activity monitoring for your peace of mind',
      icon: '🤖',
      image: '🎯',
      color: '#ff6b6b'
    },
    {
      title: 'Loving Caregivers',
      description: 'Trained, certified professionals who nurture your child with motherly affection',
      icon: '👩‍🏫',
      image: '❤️',
      color: '#feca57'
    },
    {
      title: 'Live Parent Dashboard',
      description: 'Real-time photos, videos, and activity updates directly on your smartphone',
      icon: '📊',
      image: '📱',
      color: '#48dbfb'
    },
    {
      title: 'Nutritious Meals',
      description: 'Home-style, hygienic meals with options for dietary preferences and allergies',
      icon: '🍼',
      image: '🥘',
      color: '#ff9ff3'
    },
    {
      title: 'Cultural Learning',
      description: 'Stories, songs, and values rooted in Indian culture and traditions',
      icon: '🎨',
      image: '🪷',
      color: '#1dd1a1'
    },
    {
      title: 'Medical Support',
      description: '24/7 medical support with quick pediatrician consultations when needed',
      icon: '🏥',
      image: '💊',
      color: '#ff6348'
    },
    {
      title: 'Multi-Language Support',
      description: 'Communication in Hindi, English, and regional languages you prefer',
      icon: '🗣️',
      image: '📖',
      color: '#5f27cd'
    },
    {
      title: 'Festival Celebrations',
      description: 'Celebrating Diwali, Holi, Raksha Bandhan, and all festivals together',
      icon: '🎉',
      image: '🪔',
      color: '#f368e0'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Senior Software Engineer',
      company: 'Tech Corp India',
      location: 'Bangalore',
      quote: 'ForMa gave me back my career and peace of mind. My daughter loves going there every morning! The caregivers know her favorite songs and her meal preferences. I work completely stress-free now.',
      image: '👩‍💼',
      rating: 5,
      highlight: 'Peace of mind at work'
    },
    {
      name: 'Anjali Menon',
      role: 'Marketing Manager',
      company: 'Brand Solutions',
      location: 'Mumbai',
      quote: 'The real-time photos and updates make me feel connected even during important meetings. The staff speaks Malayalam with my son - that personal touch means everything to our family!',
      image: '👩‍💻',
      rating: 5,
      highlight: 'Cultural connection'
    },
    {
      name: 'Lakshmi Reddy',
      role: 'Medical Officer',
      company: 'City Hospital',
      location: 'Hyderabad',
      quote: 'As a doctor, I\'m very particular about hygiene and safety. ForMa\'s cleanliness and trained staff exceeded all my expectations. My daughter has learned so many rhymes and cultural values here!',
      image: '👩‍⚕️',
      rating: 5,
      highlight: 'Quality & hygiene'
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
        <div className="hero-decorations">
          <div className="decoration-flower flower-1">🌸</div>
          <div className="decoration-flower flower-2">🪷</div>
          <div className="decoration-flower flower-3">🌺</div>
          <div className="decoration-rangoli">✨</div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-dot">🔴</span>
              <span>Empowering Indian Mothers Since 2026</span>
            </div>
            <h1 className="hero-headline">
              <span className="headline-top">Being a Mother</span>
              <span className="headline-and">AND</span>
              <span className="headline-bottom">Building a Career</span>
              <span className="headline-tagline">You Can Have Both ✨</span>
            </h1>
            <p className="hero-subheadline">
              <strong>Every Indian mother deserves both:</strong> The joy of seeing her child grow 
              AND the fulfillment of her professional dreams. With ForMa's AI-assisted, 
              culturally-rooted childcare, <strong>you don't have to choose.</strong>
            </p>
            <div className="hero-buttons">
              <button className="btn-primary-large" onClick={() => navigate('/register')}>
                <span>Get Started</span>
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
                <span>Government Certified</span>
              </div>
              <div className="trust-badge">
                <span className="badge-icon">🔒</span>
                <span>100% Safe & Secure</span>
              </div>
              <div className="trust-badge">
                <span className="badge-icon">❤️</span>
                <span>Trained Caregivers</span>
              </div>
            </div>
            <div className="hero-stats-inline">
              <div className="inline-stat">
                <span className="stat-num">500+</span>
                <span className="stat-text">Happy Mothers</span>
              </div>
              <div className="inline-stat">
                <span className="stat-num">15+</span>
                <span className="stat-text">Partner Companies</span>
              </div>
              <div className="inline-stat">
                <span className="stat-num">98%</span>
                <span className="stat-text">Satisfaction Rate</span>
              </div>
            </div>
          </div>
          <div className="hero-illustration">
            <img 
              src="https://i.ibb.co/fzCMrcfP/Chat-GPT-Image-Jan-28-2026-10-42-09-PM.png" 
              alt="Indian mother and child" 
              className="hero-main-image"
            />
          </div>
        </div>
      </section>

      {/* Cultural Values Section - NEW */}
      <section className="cultural-section">
        <div className="section-container">
          <div className="cultural-header">
            <h2 className="section-title">Indian Culture + Modern Care</h2>
            <p className="section-subtitle">Where tradition meets innovation - the best of both worlds for your child</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="value-icon-large">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-subtitle">{value.subtitle}</p>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="problem-section">
        <div className="section-container">
          <h2 className="section-title">The Reality Indian Mothers Face</h2>
          <p className="section-subtitle">These aren't just numbers—they're dreams postponed, careers paused, and potential unrealized</p>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ 
                animationDelay: `${index * 0.1}s`,
                borderColor: stat.color
              }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number" style={{ color: stat.color }}>{stat.number}</div>
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
          <p className="section-subtitle">Simple, seamless, and designed with Indian mothers in mind</p>
          <div className="steps-container">
            {howItWorks.map((step, index) => (
              <div 
                key={index} 
                className={`step-card ${activeStep === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveStep(index)}
                style={{ borderTopColor: step.color }}
              >
                <div className="step-number" style={{ backgroundColor: step.color }}>
                  {step.step}
                </div>
                <div className="step-icon" style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)` }}>
                  {step.icon}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <h4 className="step-subtitle">{step.subtitle}</h4>
                <p className="step-description">{step.description}</p>
                <ul className="step-details">
                  {step.details.map((detail, idx) => (
                    <li key={idx}>
                      <span className="detail-check">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Flowing River Design */}
      <section className="features-river-section">
        <div className="section-container">
          <div className="river-header">
            <span className="river-badge">✨ 500+ Mothers Trust Us</span>
            <h2 className="river-title">
              Everything You Need, <span className="river-highlight">Beautifully Simple</span>
            </h2>
          </div>

          <div className="features-river">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`river-bubble river-bubble-${index + 1}`}
                style={{ 
                  '--bubble-color': feature.color,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="bubble-glow"></div>
                <div className="bubble-content">
                  <span className="bubble-icon">{feature.icon}</span>
                  <h3 className="bubble-title">{feature.title}</h3>
                  <p className="bubble-desc">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="river-footer">
            <div className="river-guarantee">
              <span className="guarantee-shield">🛡️</span>
              <div>
                <strong>30-Day Money-Back Guarantee</strong>
                <span>100% Risk-Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Compact */}
      <section className="testimonials-section">
        <div className="section-container">
          <h2 className="section-title-compact">Stories from Mothers Like You</h2>
          <p className="section-subtitle-compact">Real experiences, real impact</p>
          
          <div className="testimonials-compact">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`testimonial-compact ${activeTestimonial === index ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(index)}
              >
                <div className="testimonial-compact-header">
                  <div className="testimonial-avatar-compact">{testimonial.image}</div>
                  <div className="testimonial-info-compact">
                    <h4 className="testimonial-name-compact">{testimonial.name}</h4>
                    <p className="testimonial-role-compact">{testimonial.role}</p>
                    <div className="testimonial-location-compact">📍 {testimonial.location}</div>
                  </div>
                  <div className="testimonial-rating-compact">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="star-compact">⭐</span>
                    ))}
                  </div>
                </div>
                <p className="testimonial-quote-compact">"{testimonial.quote}"</p>
                <span className="testimonial-highlight-compact">{testimonial.highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section - Compact Expandable */}
      <section className="founder-section-compact">
        <div className="section-container">
          <div className="founder-card-compact" onClick={(e) => {
            if (!e.target.closest('.founder-expand-btn')) {
              e.currentTarget.classList.toggle('expanded');
            }
          }}>
            <div className="founder-layout">
              <div className="founder-photo-section">
                <div className="founder-photo-frame">
                  <div className="founder-photo-large">👩‍🎓</div>
                  <div className="photo-decorations">
                    <span className="deco-badge badge-1">📚</span>
                    <span className="deco-badge badge-2">🧬</span>
                    <span className="deco-badge badge-3">👶</span>
                    <span className="deco-badge badge-4">💝</span>
                  </div>
                </div>
              </div>

              <div className="founder-info-section">
                <div className="founder-header-info">
                  <h3 className="founder-name-large">Aishwarya Mohan Kayattukandy</h3>
                  <p className="founder-role-large">Founder & Advocate for Working Mothers</p>
                  <div className="founder-credentials-row">
                    <span className="cred-tag">📚 PGDRP - Rural Planning</span>
                    <span className="cred-tag">🧬 AIBAS - Biotechnology</span>
                    <span className="cred-tag">👶 Child Development Research</span>
                  </div>
                </div>

                <div className="founder-preview">
                  <p className="founder-quote-compact">
                    "I witnessed the silent struggle. No one should have to choose between career and family. That's why ForMa exists."
                  </p>
                </div>

                <button className="founder-expand-btn" onClick={(e) => {
                  e.stopPropagation();
                  e.currentTarget.closest('.founder-card-compact').classList.toggle('expanded');
                }}>
                  <span className="expand-text-btn">Read Full Story</span>
                  <span className="expand-icon">→</span>
                </button>

                <div className="founder-expanded-content">
                  <div className="founder-story-sections">
                    <div className="story-block">
                      <h4>💡 The Awakening</h4>
                      <p>During my research, I interviewed over 200 working mothers across India. Their stories weren't just data—they were heartbreaks.</p>
                    </div>
                    <div className="story-block">
                      <h4>🎯 From Research to Action</h4>
                      <p>ForMa transforms academic research into real solutions. Every feature comes from hours of listening to mothers' real needs.</p>
                    </div>
                    <div className="story-block">
                      <h4>🤝 Collective Vision</h4>
                      <p>This isn't about creating solutions for mothers—it's about learning from mothers to create solutions with them.</p>
                    </div>
                  </div>
                  <div className="founder-stats-row">
                    <div className="mini-stat">
                      <span className="stat-num">200+</span>
                      <span className="stat-label">Mothers</span>
                    </div>
                    <div className="mini-stat">
                      <span className="stat-num">15+</span>
                      <span className="stat-label">Districts</span>
                    </div>
                    <div className="mini-stat">
                      <span className="stat-num">100%</span>
                      <span className="stat-label">Dedication</span>
                    </div>
                  </div>
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

      {/* Footer - Horizontal Layout */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-emoji">🤱</span>
                <span className="logo-text">ForMa</span>
              </div>
              <p className="footer-tagline">Because every mother deserves to thrive</p>
              <p className="footer-description">
                AI-assisted, human-touched childcare empowering working mothers across India.
              </p>
              <div className="footer-social">
                <a href="#facebook" className="social-link" title="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#instagram" className="social-link" title="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#twitter" className="social-link" title="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#linkedin" className="social-link" title="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="footer-links-horizontal">
              <div className="footer-column">
                <h4>About</h4>
                <ul>
                  <li><a href="#mission">Our Mission</a></li>
                  <li><a href="#founder">Our Founder</a></li>
                  <li><a href="#impact">Social Impact</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Services</h4>
                <ul>
                  <li><a href="#childcare">Childcare</a></li>
                  <li><a href="#monitoring">AI Monitoring</a></li>
                  <li><a href="#nutrition">Nutrition Plans</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Partners</h4>
                <ul>
                  <li><a href="#corporate">Corporate</a></li>
                  <li><a href="#csr">CSR</a></li>
                  <li><a href="#pilot">Start a Pilot</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <ul>
                  <li><a href="#faq">FAQs</a></li>
                  <li><a href="#contact">Contact</a></li>
                  <li><a href="#blog">Blog</a></li>
                </ul>
              </div>
            </div>
            
            <div className="footer-newsletter">
              <h4>Stay Updated</h4>
              <p>Get tips & updates</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email" />
                <button>→</button>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-copyright">
              <p>© 2026 ForMa. All rights reserved. Made with 💕 for mothers across India</p>
            </div>
            <div className="footer-legal">
              <a href="#privacy">Privacy</a>
              <span className="separator">•</span>
              <a href="#terms">Terms</a>
              <span className="separator">•</span>
              <a href="#cookies">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
