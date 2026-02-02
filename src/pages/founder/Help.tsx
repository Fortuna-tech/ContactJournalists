import { Card } from "@/components/ui/card";

const Help = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Help</h1>
      <Card className="p-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Home</h2>
            <p className="text-muted-foreground mb-4">
              Here on your home page you'll see journalist requests for all categories. Click on your category to narrow down the live requests.
            </p>
            <img src="/assets/Help1.png" alt="Home" className="rounded-lg max-w-full" />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Find Journalists</h2>
            <p className="text-muted-foreground mb-4">
              Find journalists in your niche.
            </p>
            <img src="/assets/Help2.png" alt="Find Journalists" className="rounded-lg max-w-full" />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">AI Press Pitch</h2>
            <p className="text-muted-foreground mb-4">
              Allows you to quickly generate a pitch based on your brand.
            </p>
            <img src="/assets/Help3.png" alt="AI Press Pitch" className="rounded-lg max-w-full" />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Media Lists</h2>
            <p className="text-muted-foreground mb-4">
              Organise your contacts into various folders etc.
            </p>
            <img src="/assets/Help4.png" alt="Media Lists" className="rounded-lg max-w-full" />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-muted-foreground mb-4">
              Change your company name, categories and links.
            </p>
            <img src="/assets/Help5.png" alt="Settings" className="rounded-lg max-w-full" />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Having issues?</h2>
            <p className="text-muted-foreground">
              Email hello@contactjournalists.com and hit us up. We're in beta right now and would love your feedback!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Help;
