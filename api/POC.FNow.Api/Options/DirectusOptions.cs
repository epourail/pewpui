namespace POC.FNow.Api.Options
{
    public class DirectusOptions
    {
        public string Url { get; set; } = null!;
        public Dictionary<string, string> ExtraHeaders { get; set; } = new Dictionary<string, string>();
        public string PermToken { get; set; } = null!;
    }
}
