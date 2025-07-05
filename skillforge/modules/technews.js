// Tech News Module
window.TechNews = {
    currentFilter: 'all',
    newsData: [],
    
    async init() {
        this.setupEventListeners();
        await this.loadNews();
    },
    
    setupEventListeners() {
        // Filter chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.filterNews();
            });
        });
    },
    
    async loadNews() {
        const loadingEl = document.getElementById('newsLoading');
        const gridEl = document.getElementById('newsGrid');
        
        try {
            // Show loading
            loadingEl.style.display = 'flex';
            gridEl.style.display = 'none';
            
            // Mock news data (replace with real API)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.newsData = this.getMockNewsData();
            this.renderNews();
            
            // Hide loading, show grid
            loadingEl.style.display = 'none';
            gridEl.style.display = 'grid';
            
        } catch (error) {
            console.error('Failed to load news:', error);
            loadingEl.innerHTML = '<p>Failed to load news. Please try again later.</p>';
        }
    },
    
    getMockNewsData() {
        return [
            {
                title: "AWS Announces New Serverless Computing Features",
                description: "Amazon Web Services introduces enhanced Lambda functions with improved performance and cost optimization features for enterprise applications.",
                source: "TechCrunch",
                publishedAt: "2024-01-15T10:30:00Z",
                url: "https://techcrunch.com/aws-serverless",
                category: "cloud"
            },
            {
                title: "React 19 Beta Released with Revolutionary Features",
                description: "The latest React beta introduces concurrent rendering improvements and new hooks that will change how developers build user interfaces.",
                source: "React Blog",
                publishedAt: "2024-01-14T14:20:00Z",
                url: "https://react.dev/blog/react-19-beta",
                category: "frontend"
            },
            {
                title: "Node.js 21 Brings Performance Improvements",
                description: "The latest Node.js release focuses on performance enhancements and better memory management for server-side applications.",
                source: "Node.js Foundation",
                publishedAt: "2024-01-13T09:15:00Z",
                url: "https://nodejs.org/en/blog/release/v21",
                category: "backend"
            },
            {
                title: "Google Cloud Introduces AI-Powered Development Tools",
                description: "New machine learning tools help developers build smarter applications with integrated AI capabilities and automated code generation.",
                source: "Google Cloud Blog",
                publishedAt: "2024-01-12T16:45:00Z",
                url: "https://cloud.google.com/blog/ai-tools",
                category: "cloud"
            },
            {
                title: "Next.js 14 Revolutionizes Full-Stack Development",
                description: "The latest Next.js release brings server components, improved routing, and better performance optimization for modern web applications.",
                source: "Vercel",
                publishedAt: "2024-01-11T11:30:00Z",
                url: "https://nextjs.org/blog/next-14",
                category: "frontend"
            },
            {
                title: "Python 3.12 Released with Enhanced Performance",
                description: "The new Python version delivers significant speed improvements and new syntax features for better developer productivity.",
                source: "Python.org",
                publishedAt: "2024-01-10T13:20:00Z",
                url: "https://python.org/downloads/release/python-3120",
                category: "backend"
            },
            {
                title: "Microsoft Azure Expands Edge Computing Services",
                description: "New edge computing solutions enable faster processing and reduced latency for IoT and real-time applications.",
                source: "Microsoft Azure",
                publishedAt: "2024-01-09T08:45:00Z",
                url: "https://azure.microsoft.com/blog/edge-computing",
                category: "cloud"
            },
            {
                title: "Vue.js 3.4 Introduces Composition API Enhancements",
                description: "Latest Vue.js update brings improved TypeScript support and better performance for component-based applications.",
                source: "Vue.js Blog",
                publishedAt: "2024-01-08T15:10:00Z",
                url: "https://vuejs.org/blog/vue-3-4",
                category: "frontend"
            },
            {
                title: "Express.js 5.0 Beta Brings Modern JavaScript Support",
                description: "The popular Node.js framework gets a major update with ES6+ features and improved middleware architecture.",
                source: "Express.js",
                publishedAt: "2024-01-07T12:30:00Z",
                url: "https://expressjs.com/blog/express-5-beta",
                category: "backend"
            },
            {
                title: "Kubernetes 1.29 Enhances Container Orchestration",
                description: "New Kubernetes release focuses on security improvements and better resource management for cloud-native applications.",
                source: "CNCF",
                publishedAt: "2024-01-06T10:15:00Z",
                url: "https://kubernetes.io/blog/kubernetes-1-29",
                category: "cloud"
            }
        ];
    },
    
    filterNews() {
        const filteredNews = this.currentFilter === 'all' 
            ? this.newsData 
            : this.newsData.filter(article => article.category === this.currentFilter);
        
        this.renderNews(filteredNews);
    },
    
    renderNews(articles = this.newsData) {
        const gridEl = document.getElementById('newsGrid');
        
        gridEl.innerHTML = articles.map(article => `
            <div class="news-card">
                <h3 class="news-title">${article.title}</h3>
                <p class="news-description">${this.truncateText(article.description, 120)}</p>
                <div class="news-meta">
                    <span class="news-source">${article.source}</span>
                    <span class="news-date">${this.formatDate(article.publishedAt)}</span>
                </div>
                <button class="read-more-btn" onclick="window.open('${article.url}', '_blank')">
                    Read More
                </button>
            </div>
        `).join('');
    },
    
    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }
};