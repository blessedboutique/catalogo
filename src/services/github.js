import { Octokit } from "octokit";

export class GitHubService {
    constructor(token, owner, repo) {
        this.octokit = new Octokit({ auth: token });
        this.owner = owner;
        this.repo = repo;
        this.branch = 'main'; // Assuming main branch
    }

    async getFile(path) {
        try {
            const response = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner: this.owner,
                repo: this.repo,
                path: path,
                ref: this.branch,
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching file:", error);
            return null;
        }
    }

    async updateFile(path, content, message, sha = null) {
        // Encode content to Base64 (handling UTF-8 characters)
        const contentEncoded = btoa(unescape(encodeURIComponent(content)));

        const params = {
            owner: this.owner,
            repo: this.repo,
            path: path,
            message: message,
            content: contentEncoded,
            branch: this.branch,
        };

        if (sha) {
            params.sha = sha;
        }

        const response = await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', params);
        return response.data;
    }

    async uploadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async () => {
                try {
                    const content = new Uint8Array(reader.result);
                    // Convert Uint8Array to binary string for btoa
                    let binary = '';
                    const len = content.byteLength;
                    for (let i = 0; i < len; i++) {
                        binary += String.fromCharCode(content[i]);
                    }
                    const contentBase64 = btoa(binary);

                    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '-')}`;
                    const path = `public/images/${fileName}`;

                    await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                        owner: this.owner,
                        repo: this.repo,
                        path: path,
                        message: `Upload image ${fileName}`,
                        content: contentBase64,
                        branch: this.branch,
                    });

                    // Return the raw GitHub URL so it works immediately without waiting for Pages build
                    // Format: https://raw.githubusercontent.com/{owner}/{repo}/{branch}/public/images/{fileName}
                    const rawUrl = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/public/images/${fileName}`;
                    resolve(rawUrl);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = error => reject(error);
        });
    }

    async getProducts() {
        const file = await this.getFile('src/data/products.json');
        if (!file) return { content: [], sha: null };

        // Decode Base64 content (handling UTF-8)
        const content = decodeURIComponent(escape(atob(file.content)));
        return {
            content: JSON.parse(content),
            sha: file.sha
        };
    }

    async saveProducts(products, sha) {
        const content = JSON.stringify(products, null, 2);
        return await this.updateFile('src/data/products.json', content, 'Update products list', sha);
    }
}
