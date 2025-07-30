import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>UpskillBro</h3>
            <p>Your AI Career Co-Pilot for personalized developer learning</p>
          </div>
          
          <div class="footer-section">
            <h4>Features</h4>
            <ul>
              <li>AI Roadmaps</li>
              <li>Mock Interviews</li>
              <li>Mentorship</li>
              <li>Tech News</li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Support</h4>
            <ul>
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Connect</h4>
            <ul>
              <li>Twitter</li>
              <li>LinkedIn</li>
              <li>GitHub</li>
              <li>Discord</li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2024 UpskillBro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {}