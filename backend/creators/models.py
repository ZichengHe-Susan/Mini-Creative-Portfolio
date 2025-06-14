from django.db import models


class CreativeField(models.Model):
    """Model for creative fields/categories"""
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Creator(models.Model):
    """Model for creative user profiles"""
    name = models.CharField(max_length=100)
    profile_picture = models.ImageField(
        upload_to='profile_pics/', 
        blank=True, 
        null=True
    )
    bio = models.TextField(max_length=500, blank=True)
    creative_fields = models.ManyToManyField(
        CreativeField, 
        blank=True,
        related_name='creators'
    )
    portfolio_link_1 = models.URLField(max_length=200, blank=True)
    portfolio_link_2 = models.URLField(max_length=200, blank=True)
    portfolio_link_3 = models.URLField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']

    @property
    def portfolio_links(self):
        """Return a list of non-empty portfolio links"""
        links = []
        if self.portfolio_link_1:
            links.append(self.portfolio_link_1)
        if self.portfolio_link_2:
            links.append(self.portfolio_link_2)
        if self.portfolio_link_3:
            links.append(self.portfolio_link_3)
        return links 