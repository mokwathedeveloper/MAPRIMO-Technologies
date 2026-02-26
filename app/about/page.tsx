export const metadata = {
  title: "About Us | MAPRIMO Technologies",
  description: "Learn more about MAPRIMO Technologies and our mission to help startups ship quality software.",
};

export default function AboutPage() {
  return (
    <div className="container py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About MAPRIMO</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-xl text-muted-foreground mb-6">
            We are a specialized software engineering firm focused on helping SMEs and funded startups navigate the complexities of product development.
          </p>
          
          <h2 className="text-2xl font-semibold mt-12 mb-4">Our Philosophy</h2>
          <p className="mb-6">
            We believe that speed and quality are not mutually exclusive. By embedding QA into the development process from day one, we help our clients ship faster by breaking less.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4">Why MAPRIMO?</h2>
          <ul className="list-disc pl-6 space-y-4 mb-8">
            <li>
              <strong>QA First Mentality:</strong> We don&apos;t just write code; we ensure it works at scale through robust automation.
            </li>
            <li>
              <strong>Startup Speed:</strong> We understand the pressure of time-to-market and build with agility in mind.
            </li>
            <li>
              <strong>Transparency:</strong> No technical jargon—just clear communication and regular updates.
            </li>
          </ul>

          <div className="bg-muted p-8 rounded-lg mt-16">
            <h2 className="text-2xl font-semibold mb-4 text-center">Ready to work together?</h2>
            <p className="text-center mb-0">
              We&apos;re always looking for exciting projects to help take to the next level.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
