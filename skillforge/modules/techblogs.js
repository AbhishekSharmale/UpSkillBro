// Tech Blogs Module
window.TechBlogs = {
    blogs: [],
    
    async init() {
        this.checkAdminAccess();
        this.loadBlogs();
        this.setupEventListeners();
    },
    
    checkAdminAccess() {
        const urlParams = new URLSearchParams(window.location.search);
        const isAdmin = urlParams.get('admin') === 'true';
        
        const adminBtn = document.getElementById('adminPortalBtn');
        if (isAdmin) {
            adminBtn.style.display = 'block';
        } else {
            adminBtn.style.display = 'none';
        }
    },
    
    setupEventListeners() {
        // Admin portal button
        document.getElementById('adminPortalBtn').addEventListener('click', () => {
            this.openAdminPortal();
        });
        
        // Close admin modal
        document.getElementById('closeAdmin').addEventListener('click', () => {
            this.closeAdminPortal();
        });
        
        // Cancel button
        document.getElementById('cancelBlog').addEventListener('click', () => {
            this.closeAdminPortal();
        });
        
        // Blog form submission
        document.getElementById('blogForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.publishBlog();
        });
        
        // Close modal on outside click
        document.getElementById('adminModal').addEventListener('click', (e) => {
            if (e.target.id === 'adminModal') {
                this.closeAdminPortal();
            }
        });
    },
    
    loadBlogs() {
        // Load from localStorage or use demo data
        const savedBlogs = localStorage.getItem('techBlogs');
        if (savedBlogs) {
            this.blogs = JSON.parse(savedBlogs);
        } else {
            this.blogs = this.getDemoBlogs();
            this.saveBlogs();
        }
        this.renderBlogs();
    },
    
    getDemoBlogs() {
        return [
            {
                id: 1,
                title: "Why React 19 is a Game Changer for Frontend Development",
                author: "Sarah Chen",
                content: "React 19 introduces revolutionary features that will transform how we build user interfaces. The new concurrent rendering system allows for better performance and user experience. Server components enable faster loading times and improved SEO. The enhanced hooks system provides more flexibility for state management and side effects. These improvements make React 19 a significant leap forward in frontend development.",
                tags: ["React", "Frontend", "JavaScript", "Performance"],
                publishedAt: "2024-01-15T10:00:00Z"
            },
            {
                id: 2,
                title: "Top 5 Tools Every Backend Developer Needs in 2024",
                author: "Mike Rodriguez",
                content: "Backend development has evolved significantly, and having the right tools is crucial for productivity. Docker containers streamline deployment and environment consistency. Postman simplifies API testing and documentation. Redis provides fast caching solutions. MongoDB offers flexible data storage. GitHub Actions automates CI/CD pipelines. These tools form the foundation of modern backend development workflows.",
                tags: ["Backend", "Tools", "DevOps", "Productivity"],
                publishedAt: "2024-01-12T14:30:00Z"
            },
            {
                id: 3,
                title: "Mastering Cloud Architecture: AWS vs Azure vs GCP",
                author: "David Kim",
                content: "Choosing the right cloud platform is critical for project success. AWS offers the most comprehensive service catalog and mature ecosystem. Azure integrates seamlessly with Microsoft technologies and enterprise environments. Google Cloud Platform excels in machine learning and data analytics capabilities. Each platform has unique strengths that align with different use cases and organizational needs.",
                tags: ["Cloud", "AWS", "Azure", "GCP", "Architecture"],
                publishedAt: "2024-01-10T09:15:00Z"
            },
            {
                id: 4,
                title: "Building Scalable APIs with Node.js and Express",
                author: "Emma Thompson",
                content: "Creating robust APIs requires careful planning and implementation. Express.js provides a minimal yet powerful framework for building web applications. Proper middleware usage ensures security and performance. Database optimization techniques improve response times. Caching strategies reduce server load. Error handling and logging provide better debugging capabilities. Following these practices results in maintainable and scalable API architectures.",
                tags: ["Node.js", "Express", "API", "Backend", "Scalability"],
                publishedAt: "2024-01-08T16:45:00Z"
            },
            {
                id: 5,
                title: "The Future of Full-Stack Development with Next.js",
                author: "Alex Johnson",
                content: "Next.js continues to evolve as the premier full-stack React framework. Server-side rendering improves SEO and initial load times. API routes enable backend functionality within the same codebase. Static site generation provides optimal performance for content-heavy sites. The App Router introduces new patterns for organizing applications. These features make Next.js an excellent choice for modern web development.",
                tags: ["Next.js", "Full-Stack", "React", "SSR", "Performance"],
                publishedAt: "2024-01-05T11:20:00Z"
            }
        ];
    },
    
    renderBlogs() {
        const gridEl = document.getElementById('blogsGrid');
        
        gridEl.innerHTML = this.blogs.map(blog => `
            <div class="blog-card" onclick="TechBlogs.openBlogDetail(${blog.id})">
                <h3 class="blog-title">${blog.title}</h3>
                <div class="blog-author">By ${blog.author}</div>
                <p class="blog-preview">${this.truncateText(blog.content, 150)}</p>
                <div class="blog-tags">
                    ${blog.tags.map(tag => `<span class="blog-tag">#${tag}</span>`).join('')}
                </div>
                <div class="blog-date">${this.formatDate(blog.publishedAt)}</div>
            </div>
        `).join('');
    },
    
    openAdminPortal() {
        document.getElementById('adminModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },
    
    closeAdminPortal() {
        document.getElementById('adminModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetForm();
    },
    
    resetForm() {
        document.getElementById('blogForm').reset();
    },
    
    publishBlog() {
        const title = document.getElementById('blogTitle').value;
        const author = document.getElementById('blogAuthor').value;
        const content = document.getElementById('blogContent').value;
        const tagsInput = document.getElementById('blogTags').value;
        
        const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        const newBlog = {
            id: Date.now(),
            title,
            author,
            content,
            tags,
            publishedAt: new Date().toISOString()
        };
        
        this.blogs.unshift(newBlog);
        this.saveBlogs();
        this.renderBlogs();
        this.closeAdminPortal();
        
        // Show success notification
        if (window.UpskillBro && window.UpskillBro.showNotification) {
            window.UpskillBro.showNotification('Blog published successfully!', 'success');
        }
    },
    
    saveBlogs() {
        localStorage.setItem('techBlogs', JSON.stringify(this.blogs));
    },
    
    openBlogDetail(blogId) {
        const blog = this.blogs.find(b => b.id === blogId);
        if (!blog) return;
        
        // Create blog detail modal
        const modal = document.createElement('div');
        modal.className = 'blog-detail-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            z-index: 2001;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        `;
        
        modal.innerHTML = `
            <div style="
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: 20px;
                width: 100%;
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                padding: 2rem;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2 style="color: var(--accent-primary); margin: 0;">${blog.title}</h2>
                    <button onclick="this.closest('.blog-detail-modal').remove(); document.body.style.overflow = 'auto';" style="
                        background: none;
                        border: none;
                        color: var(--text-secondary);
                        font-size: 1.5rem;
                        cursor: pointer;
                        padding: 0.5rem;
                        border-radius: 50%;
                        transition: all 0.2s ease;
                    ">×</button>
                </div>
                <div style="margin-bottom: 1rem;">
                    <span style="color: var(--accent-primary); font-weight: 600;">By ${blog.author}</span>
                    <span style="color: var(--text-muted); margin-left: 1rem;">${this.formatDate(blog.publishedAt)}</span>
                </div>
                <div style="margin-bottom: 2rem;">
                    ${blog.tags.map(tag => `<span class="blog-tag">#${tag}</span>`).join('')}
                </div>
                <div style="color: var(--text-primary); line-height: 1.8; white-space: pre-wrap;">
                    ${blog.content}
                </div>
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    },
    
    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        });
    }
};