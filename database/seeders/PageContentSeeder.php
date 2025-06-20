<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PageContent;

class PageContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            // Hero Section
            ['section' => 'hero', 'field' => 'main_title', 'value' => 'Where Young Athletes'],
            ['section' => 'hero', 'field' => 'title_highlight', 'value' => 'Train Smarter — Not Just Harder'],
            ['section' => 'hero', 'field' => 'subtitle', 'value' => 'Expert guidance that builds performance, protects against injury, and brings out the best in your child.'],
            ['section' => 'hero', 'field' => 'subtitle_secondary', 'value' => 'Scientifically designed, individually delivered — and fully supported for parents.'],
            ['section' => 'hero', 'field' => 'cta_button', 'value' => 'Start Your Journey'],
            ['section' => 'hero', 'field' => 'demo_button', 'value' => 'Watch Demo'],
            ['section' => 'hero', 'field' => 'expert_name', 'value' => 'Dr Ben Pullen'],
            ['section' => 'hero', 'field' => 'expert_title', 'value' => 'PhD in Paediatric Strength Training'],
            ['section' => 'hero', 'field' => 'expert_description', 'value' => 'Leading Youth Strength & Conditioning Expert Worldwide'],
            ['section' => 'hero', 'field' => 'expert_image', 'value' => '', 'type' => 'image'],

            // About Section
            ['section' => 'about', 'field' => 'section_title', 'value' => 'Meet Dr Ben Pullen —'],
            ['section' => 'about', 'field' => 'title_highlight', 'value' => 'Expert in Youth Strength Development'],
            ['section' => 'about', 'field' => 'description', 'value' => 'The world\'s leading researcher in youth strength training, transforming how young athletes develop'],
            ['section' => 'about', 'field' => 'main_text_1', 'value' => 'This programme was created to solve a clear problem: most youth training is either watered down or misapplied adult training.'],
            ['section' => 'about', 'field' => 'main_text_2', 'value' => 'Dr Ben Pullen holds a PhD in paediatric strength training and has coached over 1,000 young athletes. His research explored how to make strength training engaging and developmentally aligned - blending sport science with psychological insight.'],
            ['section' => 'about', 'field' => 'main_text_3', 'value' => 'Now, that work is delivered to families worldwide through a structured, engaging programme that delivers results, builds confidence, and supports parents every step of the way.'],
            ['section' => 'about', 'field' => 'quote', 'value' => 'Kids don\'t need pressure — they need purposeful challenge. We train children to enjoy training, not endure it.'],
            ['section' => 'about', 'field' => 'profile_image', 'value' => '', 'type' => 'image'],

            // Training Section
            ['section' => 'training', 'field' => 'section_title', 'value' => 'A Proven System for Developing'],
            ['section' => 'training', 'field' => 'title_highlight', 'value' => 'Strong, Confident Young Athletes'],
            ['section' => 'training', 'field' => 'intro_text', 'value' => 'Our programmes are built for young athletes aged 9–12 who need more than just a generic training plan.'],

            // CTA Section
            ['section' => 'cta', 'field' => 'title', 'value' => 'Ready to Start Your Athletic Journey?'],
            ['section' => 'cta', 'field' => 'description', 'value' => 'Join thousands of young athletes who are tracking their progress, competing on leaderboards, and achieving their strength and conditioning goals.'],
            ['section' => 'cta', 'field' => 'button_text', 'value' => 'Get Started Today'],

            // Contact
            ['section' => 'contact', 'field' => 'email', 'value' => 'contact@athletetrack.com', 'type' => 'email'],
        ];

        foreach ($contents as $content) {
            PageContent::updateOrCreate(
                ['section' => $content['section'], 'field' => $content['field']],
                ['value' => $content['value'], 'type' => $content['type'] ?? 'text']
            );
        }
    }
}
