import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="news">
      <div class="container">
        <h1>Tech News & Insights</h1>
        <p>Stay updated with the latest in technology</p>
        
        <div class="news-filters">
          <button class="filter-btn active">All</button>
          <button class="filter-btn">JavaScript</button>
          <button class="filter-btn">React</button>
          <button class="filter-btn">Node.js</button>
          <button class="filter-btn">Career</button>
        </div>

        <div class="news-grid">
          <article class="news-card featured" *ngFor="let article of featuredNews">
            <div class="news-image">📰</div>
            <div class="news-content">
              <div class="news-category">{{article.category}}</div>
              <h2>{{article.title}}</h2>
              <p>{{article.excerpt}}</p>
              <div class="news-meta">
                <span>{{article.source}}</span>
                <span>{{article.date}}</span>
              </div>
            </div>
          </article>
          
          <article class="news-card" *ngFor="let article of regularNews">
            <div class="news-content">
              <div class="news-category">{{article.category}}</div>
              <h3>{{article.title}}</h3>
              <p>{{article.excerpt}}</p>
              <div class="news-meta">
                <span>{{article.source}}</span>
                <span>{{article.date}}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {
  featuredNews = [
    {
      category: 'JavaScript',
      title: 'New JavaScript Features Coming in 2024',
      excerpt: 'Explore the latest ECMAScript proposals and what they mean for developers',
      source: 'TechCrunch',
      date: '2 hours ago'
    }
  ];

  regularNews = [
    {
      category: 'React',
      title: 'React 19 Beta Released',
      excerpt: 'New features and improvements in the latest React version',
      source: 'React Blog',
      date: '1 day ago'
    },
    {
      category: 'Career',
      title: 'Remote Work Trends in Tech',
      excerpt: 'How remote work is shaping the future of tech careers',
      source: 'Dev.to',
      date: '2 days ago'
    }
  ];
}