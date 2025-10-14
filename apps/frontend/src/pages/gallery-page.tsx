import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  OptimizedImage,
  ProfileImage,
  HeroImage,
  ThumbnailImage,
  TransitionLink,
  FadeLink,
  SlideLink,
  ScaleLink,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../components/ui';

export const GalleryPage: React.FC = () => {
  // Demo images (replace with actual URLs)
  const demoImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
  ];

  return (
    <>
      <Helmet>
        <title>Gallery - Maglo</title>
        <meta
          name="description"
          content="Explore our image gallery with optimized loading and smooth transitions"
        />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience optimized image loading and smooth page transitions with GSAP animations
          </p>
        </div>

        {/* Navigation Links Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Transition Links Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <TransitionLink to="/dashboard" className="text-primary hover:underline">
                Default Transition to Dashboard
              </TransitionLink>
              <FadeLink to="/components" className="text-primary hover:underline">
                Fade to Components
              </FadeLink>
              <SlideLink to="/" className="text-primary hover:underline">
                Slide to Home
              </SlideLink>
              <ScaleLink to="/login" className="text-primary hover:underline">
                Scale to Login
              </ScaleLink>
            </div>
          </CardContent>
        </Card>

        {/* Hero Image Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Image Component</CardTitle>
          </CardHeader>
          <CardContent>
            <HeroImage
              src={demoImages[0]}
              alt="Beautiful landscape"
              className="rounded-lg"
              blur={true}
              showLoader={true}
            />
          </CardContent>
        </Card>

        {/* Profile Image Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <ProfileImage
                src={demoImages[1]}
                alt="Profile 1"
                className="w-16 h-16 rounded-full"
                lazy={false}
              />
              <ProfileImage
                src={demoImages[2]}
                alt="Profile 2"
                className="w-20 h-20 rounded-full"
                lazy={false}
              />
              <ProfileImage
                src={demoImages[3]}
                alt="Profile 3"
                className="w-24 h-24 rounded-full"
                lazy={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Thumbnail Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {demoImages.map((image, index) => (
                <ThumbnailImage
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="rounded-lg hover:scale-105 transition-transform cursor-pointer"
                  containerClassName="bg-muted"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimized Images with Different Configurations */}
        <Card>
          <CardHeader>
            <CardTitle>Different Image Configurations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">With Blur Effect</h3>
                <OptimizedImage
                  src={demoImages[4]}
                  alt="Blurred loading"
                  aspectRatio="4/3"
                  blur={true}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Object Contain</h3>
                <OptimizedImage
                  src={demoImages[5]}
                  alt="Object contain"
                  aspectRatio="4/3"
                  objectFit="contain"
                  className="rounded-lg bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Features */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Features Included</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✅ Lazy loading with Intersection Observer</li>
                  <li>✅ Blur-to-clear progressive loading</li>
                  <li>✅ Automatic fallback handling</li>
                  <li>✅ Multiple aspect ratio support</li>
                  <li>✅ Object-fit options</li>
                  <li>✅ Loading states and animations</li>
                  <li>✅ Error state handling</li>
                  <li>✅ GSAP-powered transitions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Transition Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✅ Smooth page transitions</li>
                  <li>✅ Multiple transition types</li>
                  <li>✅ Hover animations with GSAP</li>
                  <li>✅ Programmatic navigation</li>
                  <li>✅ React Router integration</li>
                  <li>✅ Customizable durations</li>
                  <li>✅ Page container detection</li>
                  <li>✅ Accessible navigation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Components */}
        <div className="text-center">
          <Button asChild size="lg">
            <FadeLink to="/components">Back to Components Showcase</FadeLink>
          </Button>
        </div>
      </div>
    </>
  );
};

export default GalleryPage;
