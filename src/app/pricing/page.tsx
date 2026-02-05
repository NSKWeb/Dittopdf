import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Star, Zap, Shield, Users, Database, Code, Clock, Heart } from 'lucide-react';
import { AdBanner } from '@/components/ads/ad-banner';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'month',
      description: 'Perfect for occasional PDF tasks',
      features: [
        '10 operations/month',
        'File size limit: 50MB',
        'Basic PDF tools',
        'Email support',
        '7-day file retention',
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'month',
      description: 'For power users and professionals',
      features: [
        '100 operations/month',
        'File size limit: 200MB',
        'All PDF tools',
        'Priority support',
        '30-day file retention',
        'Batch processing',
        'API access',
        'Custom watermarks',
      ],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$29.99',
      period: 'month',
      description: 'For teams and businesses',
      features: [
        '1,000 operations/month',
        'File size limit: 500MB',
        'All PDF tools',
        '24/7 priority support',
        'Unlimited file retention',
        'Team collaboration',
        'API access with higher limits',
        'Custom branding',
        'SSO & advanced security',
        'Dedicated account manager',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'default',
      popular: false,
    },
  ];

  const featuresComparison = [
    { name: 'PDF Merge & Split', free: true, pro: true, enterprise: true },
    { name: 'PDF Compression', free: true, pro: true, enterprise: true },
    { name: 'PDF Conversion', free: true, pro: true, enterprise: true },
    { name: 'PDF Protection', free: true, pro: true, enterprise: true },
    { name: 'Watermark & Annotations', free: true, pro: true, enterprise: true },
    { name: 'OCR (Text Recognition)', free: false, pro: true, enterprise: true },
    { name: 'Batch Processing', free: false, pro: true, enterprise: true },
    { name: 'API Access', free: false, pro: true, enterprise: true },
    { name: 'Team Collaboration', free: false, pro: false, enterprise: true },
    { name: 'Custom Branding', free: false, pro: false, enterprise: true },
    { name: 'SSO & Advanced Security', free: false, pro: false, enterprise: true },
    { name: 'Dedicated Support', free: false, pro: false, enterprise: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
              Choose the perfect plan for your PDF needs. Upgrade, downgrade, or cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`flex flex-col ${plan.popular ? 'border-2 border-primary' : ''}`}
              >
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold my-2">
                    {plan.price} <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button className="w-full" variant={plan.buttonVariant as any}>
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Features Comparison</CardTitle>
              <CardDescription>Compare all features across plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Feature</th>
                      <th className="text-center p-3 font-medium">Free</th>
                      <th className="text-center p-3 font-medium">Pro</th>
                      <th className="text-center p-3 font-medium">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featuresComparison.map((feature, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-3 font-medium">{feature.name}</td>
                        <td className="text-center p-3">
                          {feature.free ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-destructive mx-auto" />}
                        </td>
                        <td className="text-center p-3">
                          {feature.pro ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-destructive mx-auto" />}
                        </td>
                        <td className="text-center p-3">
                          {feature.enterprise ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-destructive mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">What payment methods do you accept?</h4>
                  <p className="text-sm text-muted-foreground">
                    We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for enterprise plans.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Can I cancel my subscription anytime?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can cancel your subscription at any time from your account dashboard. You will retain access until the end of your current billing period.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Do you offer discounts for non-profits or education?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, we offer special pricing for educational institutions and non-profit organizations. Please contact our sales team for more information.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">What happens if I exceed my plan limits?</h4>
                  <p className="text-sm text-muted-foreground">
                    If you exceed your plan limits, you can either upgrade your plan or purchase additional operations. We'll notify you before you reach your limits.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enterprise Solutions</CardTitle>
              <CardDescription>Custom plans for large organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">Advanced Security</h4>
                      <p className="text-sm text-muted-foreground">
                        Enterprise-grade security with SOC 2 compliance, SSO, and advanced access controls.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">Team Collaboration</h4>
                      <p className="text-sm text-muted-foreground">
                        Shared workspaces, team-based permissions, and centralized billing.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Code className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">API & Integrations</h4>
                      <p className="text-sm text-muted-foreground">
                        Custom API integrations, webhooks, and SDKs for seamless workflow automation.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">Dedicated Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Priority support with dedicated account manager and SLAs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-6" size="lg">
                Contact Sales Team
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <AdBanner type="sidebar" />

          <Card>
            <CardHeader>
              <CardTitle>Why Choose DittoPDF?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-sm">Lightning Fast</h4>
                    <p className="text-sm text-muted-foreground">
                      Process PDFs 10x faster with our optimized serverless architecture.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-sm">Enterprise Security</h4>
                    <p className="text-sm text-muted-foreground">
                      SOC 2 compliant with end-to-end encryption and audit logging.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-sm">Reliable</h4>
                    <p className="text-sm text-muted-foreground">
                      99.9% uptime with global CDN and redundant infrastructure.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                      SJ
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Sarah Johnson</h4>
                      <p className="text-xs text-muted-foreground">Marketing Director, TechCorp</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "DittoPDF Pro has saved our team countless hours. The batch processing and API access have been game-changers for our document workflow."
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                      MC
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Michael Chen</h4>
                      <p className="text-xs text-muted-foreground">Legal Counsel, LawFirm LLC</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "The enterprise security features give us peace of mind when handling sensitive client documents. Highly recommended for legal professionals."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}