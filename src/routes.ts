import { Dataset, createPlaywrightRouter } from 'crawlee';
import fetch from 'node-fetch';

export const router = createPlaywrightRouter();

const baseUrl = process.argv[2] || 'http://localhost:8000';

const add = (title: string, blogPost: string) => {
    const url = `${baseUrl}/v1/pault`;
    const data = {
        documents: [{
            data: `${title}\n\n${blogPost}`,
        }],
    };
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log('Success:', data);
    }).catch((error) => {
        console.error('Error:', error);
    });
};


router.addDefaultHandler(async ({ enqueueLinks, log }) => {
    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        globs: ['http://www.paulgraham.com/**'],
        label: 'detail',
    });
});

router.addHandler('detail', async ({ request, page, log }) => {
    const title = await page.title();
    // body > table > tbody > tr > td:nth-child(3)
    const blogPost = await page.locator('body > table > tbody > tr > td:nth-child(3)').textContent();
    if (!blogPost) {
        log.info(`no blog post found for ${title}, skipping`);
        return;
    }
    log.info(`${title}`, { url: request.loadedUrl });
    // split blog post in chunks on the \n\n
    const chunks = blogPost.split(/\n\n/);
    if (!chunks) {
        log.info(`no blog post found for ${title}, skipping`);
        return;
    }
    await Promise.all(chunks.flatMap((chunk) => {
        const d = {
            url: request.loadedUrl,
            title: title,
            blogPost: chunk,
        };
        return Promise.all([Dataset.pushData(d), add(title, chunk)]);
    }));
});
