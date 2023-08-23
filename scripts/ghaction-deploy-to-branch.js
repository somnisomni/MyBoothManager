/* eslint-disable @typescript-eslint/no-var-requires */
const DEPLOY_BRANCH = "deploy";

async function deploy() {
  try {
    const execa = (await import("execa")).execa;

    /* Checkout to orphan deploy branch */
    console.info("Checking out to orphan deploy branch...");
    await execa("git", ["checkout", "--orphan", DEPLOY_BRANCH]);

    /* Yarn build */
    console.info("Building...");
    await execa("yarn", ["build"]);

    /* Commit build(dist) files */
    console.info("Committing build files...");
    await execa("git", ["--work-tree", "dist", "add", "--all", "--force"]);
    await execa("git", ["--work-tree", "dist", "commit", "-m", "Deploy"]);

    /* Push to deploy branch */
    console.info("Pushing to deploy branch...");
    await execa("git", ["push", "origin", `HEAD:${DEPLOY_BRANCH}`, "--force"]);

    /* Cleanup */
    console.info("Cleaning up...");
    await execa("rm", ["-r", "dist"]);
    await execa("git", ["checkout", "-f", "main"]);
    await execa("git", ["branch", "-D", DEPLOY_BRANCH]);

    /* Done */
    console.info("Deployed successfully!");
  } catch(error) {
    console.error(error);
    process.exit(1);
  }
}

deploy();
