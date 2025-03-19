
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-border mt-20">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-md bg-pivot-blue flex items-center justify-center">
                <span className="text-white font-semibold">P</span>
              </div>
              <span className="text-lg font-semibold">Pivot Analytics</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transforming data into actionable business intelligence with advanced analytics and AI solutions.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:contact@pivotanalytics.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services/data-analysis" className="text-muted-foreground hover:text-foreground transition-colors">Data Analysis</Link></li>
              <li><Link to="/services/predictive-modeling" className="text-muted-foreground hover:text-foreground transition-colors">Predictive Modeling</Link></li>
              <li><Link to="/services/data-visualization" className="text-muted-foreground hover:text-foreground transition-colors">Data Visualization</Link></li>
              <li><Link to="/services/ai-integration" className="text-muted-foreground hover:text-foreground transition-colors">AI Integration</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/case-studies" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</Link></li>
              <li><Link to="/tools" className="text-muted-foreground hover:text-foreground transition-colors">Free Tools</Link></li>
              <li><Link to="/insights" className="text-muted-foreground hover:text-foreground transition-colors">Industry Insights</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/team" className="text-muted-foreground hover:text-foreground transition-colors">Our Team</Link></li>
              <li><Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Pivot Analytics LLC. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
