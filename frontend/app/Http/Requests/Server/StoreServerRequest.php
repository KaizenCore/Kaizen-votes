<?php

namespace App\Http\Requests\Server;

use Illuminate\Foundation\Http\FormRequest;

class StoreServerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert empty strings to null for optional URL fields
        $this->merge([
            'banner_url' => $this->banner_url ?: null,
            'website_url' => $this->website_url ?: null,
            'discord_url' => $this->discord_url ?: null,
            'discord_webhook_url' => $this->discord_webhook_url ?: null,
            'modpack_name' => $this->modpack_name ?: null,
            'modpack_url' => $this->modpack_url ?: null,
            'launcher' => $this->launcher ?: null,
            'server_software' => $this->server_software ?: null,
            'country' => $this->country ?: null,
            'language' => $this->language ?: null,
            'minimum_age' => $this->minimum_age ?: null,
            'founded_at' => $this->founded_at ?: null,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['required', 'string', 'min:50', 'max:5000'],
            'ip_address' => ['required', 'string', 'max:255'],
            'port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            // Game info
            'server_type' => ['nullable', 'string', 'in:java,bedrock,crossplay'],
            'bedrock_port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'is_modded' => ['nullable', 'boolean'],
            'modpack_name' => ['nullable', 'string', 'max:200'],
            'modpack_url' => ['nullable', 'url', 'max:500'],
            'launcher' => ['nullable', 'string', 'in:curseforge,modrinth,technic,atlauncher,ftb,vanilla,other'],
            'minecraft_versions' => ['nullable', 'array'],
            'minecraft_versions.*' => ['string', 'max:20'],
            // Server details
            'server_software' => ['nullable', 'string', 'in:vanilla,paper,spigot,purpur,fabric,forge,neoforge,velocity,bungeecord,waterfall,other'],
            'country' => ['nullable', 'string', 'size:2'],
            'language' => ['nullable', 'string', 'max:10'],
            'accepts_cracked' => ['nullable', 'boolean'],
            'is_whitelisted' => ['nullable', 'boolean'],
            'minimum_age' => ['nullable', 'integer', 'in:13,16,18'],
            'founded_at' => ['nullable', 'date', 'before_or_equal:today'],
            // Banner
            'banner_url' => ['nullable', 'string', 'max:500000', 'regex:/^(https?:\/\/|data:image\/)/i'],
            'banner_config' => ['nullable', 'array'],
            'banner_config.text' => ['nullable', 'string', 'max:100'],
            'banner_config.subtitle' => ['nullable', 'string', 'max:200'],
            'banner_config.gradient' => ['nullable', 'string', 'max:50'],
            'banner_config.pattern' => ['nullable', 'string', 'max:50'],
            'banner_config.textEffect' => ['nullable', 'string', 'max:50'],
            'banner_config.overlay' => ['nullable', 'string', 'max:50'],
            'banner_config.backgroundEffect' => ['nullable', 'string', 'max:50'],
            'banner_config.font' => ['nullable', 'string', 'max:50'],
            'banner_config.fontSize' => ['nullable', 'integer', 'min:20', 'max:200'],
            'banner_config.subtitleSize' => ['nullable', 'integer', 'min:10', 'max:100'],
            'banner_config.showSubtitle' => ['nullable', 'boolean'],
            'banner_config.particleCount' => ['nullable', 'integer', 'min:0', 'max:200'],
            'banner_config.particleSpeed' => ['nullable', 'numeric', 'min:0', 'max:5'],
            // Links
            'website_url' => ['nullable', 'url', 'max:500'],
            'discord_url' => ['nullable', 'url', 'max:500'],
            'discord_webhook_url' => ['nullable', 'url', 'max:500'],
            'tags' => ['nullable', 'array', 'max:5'],
            'tags.*' => ['exists:tags,id'],
        ];
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'description.min' => 'Please provide a detailed description of at least 50 characters.',
            'tags.max' => 'You can select up to 5 tags.',
            'banner_url.regex' => 'The banner must be a valid URL or a data URL (from the banner generator).',
        ];
    }
}
